import { BadRequestException } from '@nestjs/common'
import { ApplicationsErrors } from 'apps/applications/application-errors'
import { DateUtil } from 'common'

// TODO to Config
const PURCHASE_MAX_TICKETS = 10
const PURCHASE_DEADLINE_MINUTES = 30

export function checkMaxTicketsForPurchase(ticketCount: number) {
    if (PURCHASE_MAX_TICKETS < ticketCount) {
        throw new BadRequestException({
            ...ApplicationsErrors.Purchase.MaxTicketsExceeded,
            maxCount: PURCHASE_MAX_TICKETS
        })
    }
}

export function checkPurchaseDeadline(startTime: Date) {
    const cutoffTime = DateUtil.addMinutes(new Date(), PURCHASE_DEADLINE_MINUTES)

    if (startTime.getTime() < cutoffTime.getTime()) {
        throw new BadRequestException({
            ...ApplicationsErrors.Purchase.DeadlineExceeded,
            deadlineMinutes: PURCHASE_DEADLINE_MINUTES,
            startTime: startTime.toString(),
            cutoffTime: cutoffTime.toString()
        })
    }
}

export function checkHeldTickets(heldTicketIds: string[], purchaseTicketIds: string[]) {
    const isAllExist = purchaseTicketIds.every((ticketId) => heldTicketIds.includes(ticketId))

    if (!isAllExist) {
        throw new BadRequestException(ApplicationsErrors.Purchase.TicketNotHeld)
    }
}
