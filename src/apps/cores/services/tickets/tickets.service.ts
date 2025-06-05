import { Injectable } from '@nestjs/common'
import { Assert, mapDocToDto } from 'common'
import { CreateTicketsResult, CreateTicketDto, TicketDto, SearchTicketsDto } from './dtos'
import { TicketDocument, TicketStatus } from './models'
import { TicketsRepository } from './tickets.repository'

@Injectable()
export class TicketsService {
    constructor(private repository: TicketsRepository) {}

    async createTickets(createDtos: CreateTicketDto[]) {
        await this.repository.createTickets(createDtos)

        return { success: true, count: createDtos.length } as CreateTicketsResult
    }

    async updateTicketStatus(ticketIds: string[], status: TicketStatus) {
        const result = await this.repository.updateTicketStatus(ticketIds, status)

        Assert.equals(
            result.matchedCount,
            result.modifiedCount,
            'The status of all tickets must be changed.'
        )

        const tickets = await this.repository.getByIds(ticketIds)

        return this.toDtos(tickets)
    }

    async searchTickets(queryDto: SearchTicketsDto) {
        const tickets = await this.repository.searchTickets(queryDto)

        return this.toDtos(tickets)
    }

    async getTicketSalesForShowtimes(showtimeIds: string[]) {
        const statuses = await this.repository.getTicketSalesForShowtimes(showtimeIds)
        return statuses
    }

    async getTickets(ticketIds: string[]) {
        const tickets = await this.repository.getByIds(ticketIds)

        return this.toDtos(tickets)
    }

    private toDto = (ticket: TicketDocument) =>
        mapDocToDto(ticket, TicketDto, [
            'id',
            'showtimeId',
            'theaterId',
            'movieId',
            'status',
            'seat'
        ])

    private toDtos = (tickets: TicketDocument[]) => tickets.map((ticket) => this.toDto(ticket))
}
