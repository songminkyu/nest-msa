import { BadRequestException, Injectable } from '@nestjs/common'
import {
    PurchaseCreateDto,
    PurchaseItemDto,
    PurchaseItemType,
    ShowtimeDto,
    ShowtimesClient,
    TicketHoldingClient,
    TicketsClient,
    TicketStatus
} from 'apps/cores'
import { DateUtil, pickItems } from 'common'
import { uniq } from 'lodash'
import { Rules } from 'shared'
import { PurchaseProcessClient } from '../purchase-process.client'

export const PurchaseErrors = {
    MaxTicketsExceeded: {
        code: 'ERR_PURCHASE_MAX_TICKETS_EXCEEDED',
        message: 'You have exceeded the maximum number of tickets allowed for purchase.'
    },
    DeadlineExceeded: {
        code: 'ERR_PURCHASE_DEADLINE_EXCEEDED',
        message: 'The purchase deadline has passed.'
    },
    TicketNotHeld: {
        code: 'ERR_PURCHASE_TICKET_NOT_HELD',
        message: 'Only held tickets can be purchased.'
    }
}

@Injectable()
export class TicketPurchaseProcessor {
    constructor(
        private ticketsService: TicketsClient,
        private showtimesService: ShowtimesClient,
        private ticketHoldingService: TicketHoldingClient,
        private purchaseProcessProxy: PurchaseProcessClient
    ) {}

    async validatePurchase(createDto: PurchaseCreateDto) {
        const ticketItems = createDto.items.filter((item) => item.type === PurchaseItemType.ticket)
        const showtimes = await this.getShowtimes(ticketItems)

        this.validateTicketCount(ticketItems)
        this.validatePurchaseTime(showtimes)
        await this.validateHeldTickets(createDto.customerId, showtimes, ticketItems)

        return true
    }

    private async getShowtimes(ticketItems: PurchaseItemDto[]) {
        const ticketIds = ticketItems.map((item) => item.ticketId)
        const tickets = await this.ticketsService.getTickets(ticketIds)
        const showtimeIds = tickets.map((ticket) => ticket.showtimeId)
        const uniqueShowtimeIds = uniq(showtimeIds)
        const showtimes = await this.showtimesService.getShowtimes(uniqueShowtimeIds)

        return showtimes
    }

    private validateTicketCount(ticketItems: PurchaseItemDto[]) {
        if (Rules.Ticket.maxTicketsPerPurchase < ticketItems.length) {
            throw new BadRequestException({
                ...PurchaseErrors.MaxTicketsExceeded,
                maxCount: Rules.Ticket.maxTicketsPerPurchase
            })
        }
    }

    private validatePurchaseTime(showtimes: ShowtimeDto[]) {
        for (const { timeRange } of showtimes) {
            const cutoffTime = DateUtil.addMinutes(new Date(), Rules.Ticket.purchaseDeadlineMinutes)

            if (timeRange.start.getTime() < cutoffTime.getTime()) {
                throw new BadRequestException({
                    ...PurchaseErrors.DeadlineExceeded,
                    deadlineMinutes: Rules.Ticket.purchaseDeadlineMinutes,
                    startTime: timeRange.start.toString(),
                    cutoffTime: cutoffTime.toString()
                })
            }
        }
    }

    private async validateHeldTickets(
        customerId: string,
        showtimes: ShowtimeDto[],
        ticketItems: PurchaseItemDto[]
    ) {
        const heldTicketIds: string[] = []

        for (const showtime of showtimes) {
            const ticketIds = await this.ticketHoldingService.findHeldTicketIds(
                showtime.id,
                customerId
            )
            heldTicketIds.push(...ticketIds)
        }

        const purchaseTicketIds = pickItems(ticketItems, 'ticketId')

        const isAllExist = purchaseTicketIds.every((ticketId) => heldTicketIds.includes(ticketId))

        if (!isAllExist) {
            throw new BadRequestException(PurchaseErrors.TicketNotHeld)
        }
    }

    async completePurchase(createDto: PurchaseCreateDto) {
        const ticketItems = createDto.items.filter((item) => item.type === PurchaseItemType.ticket)
        const ticketIds = ticketItems.map((item) => item.ticketId)

        await this.ticketsService.updateTicketStatus(ticketIds, TicketStatus.sold)

        await this.purchaseProcessProxy.emitTicketPurchased(createDto.customerId, ticketIds)

        return true
    }

    async rollbackPurchase(createDto: PurchaseCreateDto) {
        const ticketItems = createDto.items.filter((item) => item.type === PurchaseItemType.ticket)
        const ticketIds = ticketItems.map((item) => item.ticketId)

        await this.ticketsService.updateTicketStatus(ticketIds, TicketStatus.available)

        await this.purchaseProcessProxy.emitTicketPurchaseCanceled(createDto.customerId, ticketIds)

        return true
    }
}
