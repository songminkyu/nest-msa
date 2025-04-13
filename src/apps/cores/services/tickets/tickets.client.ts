import { Injectable } from '@nestjs/common'
import { ClientProxyService, InjectClientProxy } from 'common'
import { Messages } from 'shared'
import {
    CreateTicketsResult,
    SalesStatusByShowtimeDto,
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

    findAllTickets(queryDto: TicketQueryDto): Promise<TicketDto[]> {
        return this.proxy.getJson(Messages.Tickets.findAllTickets, queryDto)
    }

    getSalesStatuses(showtimeIds: string[]): Promise<SalesStatusByShowtimeDto[]> {
        return this.proxy.getJson(Messages.Tickets.getSalesStatuses, showtimeIds)
    }

    getTickets(ticketIds: string[]): Promise<TicketDto[]> {
        return this.proxy.getJson(Messages.Tickets.getTickets, ticketIds)
    }
}
