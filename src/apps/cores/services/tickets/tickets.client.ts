import { Injectable } from '@nestjs/common'
import { ClientProxyService, InjectClientProxy } from 'common'
import { Messages } from 'shared'
import { SalesStatusByShowtimeDto, TicketCreateDto, TicketDto, TicketQueryDto } from './dtos'
import { TicketStatus } from './models'
import { CreateTicketsResult } from './types'

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

    getSalesStatuses(ticketIds: string[]): Promise<SalesStatusByShowtimeDto[]> {
        return this.proxy.getJson(Messages.Tickets.getSalesStatuses, ticketIds)
    }

    getTickets(ticketIds: string[]): Promise<TicketDto[]> {
        return this.proxy.getJson(Messages.Tickets.getTickets, ticketIds)
    }
}
