import { Injectable } from '@nestjs/common'
import { ClientProxyService, InjectClientProxy } from 'common'
import { Messages } from 'shared'
import {
    CreateTicketsResult,
    TicketSalesForShowtimeDto,
    TicketCreateDto,
    TicketDto,
    TicketQueryDto
} from './dtos'
import { TicketStatus } from './models'

@Injectable()
export class TicketsClient {
    constructor(@InjectClientProxy() private proxy: ClientProxyService) {}

    createTickets(createDtos: TicketCreateDto[]): Promise<CreateTicketsResult> {
        return this.proxy.getJson(Messages.Tickets.createTickets, createDtos)
    }

    updateTicketStatus(ticketIds: string[], status: TicketStatus): Promise<TicketDto[]> {
        return this.proxy.getJson(Messages.Tickets.updateTicketStatus, { ticketIds, status })
    }

    searchTickets(queryDto: TicketQueryDto): Promise<TicketDto[]> {
        return this.proxy.getJson(Messages.Tickets.searchTickets, queryDto)
    }

    getTicketSalesForShowtimes(showtimeIds: string[]): Promise<TicketSalesForShowtimeDto[]> {
        return this.proxy.getJson(Messages.Tickets.getTicketSalesForShowtimes, showtimeIds)
    }

    getTickets(ticketIds: string[]): Promise<TicketDto[]> {
        return this.proxy.getJson(Messages.Tickets.getTickets, ticketIds)
    }
}
