import { Injectable } from '@nestjs/common'
import { ClientProxyService, InjectClientProxy } from 'common'
import { Messages } from 'shared'
import {
    CreateTicketsResult,
    TicketSalesForShowtimeDto,
    CreateTicketDto,
    TicketDto,
    SearchTicketsDto
} from './dtos'
import { TicketStatus } from './models'

@Injectable()
export class TicketsClient {
    constructor(@InjectClientProxy() private proxy: ClientProxyService) {}

    createTickets(createDtos: CreateTicketDto[]): Promise<CreateTicketsResult> {
        return this.proxy.getJson(Messages.Tickets.createTickets, createDtos)
    }

    updateTicketStatus(ticketIds: string[], status: TicketStatus): Promise<TicketDto[]> {
        return this.proxy.getJson(Messages.Tickets.updateTicketStatus, { ticketIds, status })
    }

    searchTickets(queryDto: SearchTicketsDto): Promise<TicketDto[]> {
        return this.proxy.getJson(Messages.Tickets.searchTickets, queryDto)
    }

    getTicketSalesForShowtimes(showtimeIds: string[]): Promise<TicketSalesForShowtimeDto[]> {
        return this.proxy.getJson(Messages.Tickets.getTicketSalesForShowtimes, showtimeIds)
    }

    getTickets(ticketIds: string[]): Promise<TicketDto[]> {
        return this.proxy.getJson(Messages.Tickets.getTickets, ticketIds)
    }
}
