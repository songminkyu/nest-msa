import { Controller, ParseArrayPipe } from '@nestjs/common'
import { MessagePattern, Payload } from '@nestjs/microservices'
import { Messages } from 'shared'
import { TicketCreateDto, TicketQueryDto } from './dtos'
import { TicketStatus } from './models'
import { TicketsService } from './tickets.service'
import { CreateTicketsResult } from './types'

@Controller()
export class TicketsController {
    constructor(private service: TicketsService) {}

    @MessagePattern(Messages.Tickets.createTickets)
    createTickets(
        @Payload(new ParseArrayPipe({ items: TicketCreateDto })) createDtos: TicketCreateDto[]
    ): Promise<CreateTicketsResult> {
        return this.service.createTickets(createDtos)
    }

    @MessagePattern(Messages.Tickets.updateTicketStatus)
    updateTicketStatus(
        @Payload('ticketIds') ticketIds: string[],
        @Payload('status') status: TicketStatus
    ) {
        return this.service.updateTicketStatus(ticketIds, status)
    }

    @MessagePattern(Messages.Tickets.findAllTickets)
    findAllTickets(@Payload() queryDto: TicketQueryDto) {
        return this.service.findAllTickets(queryDto)
    }

    @MessagePattern(Messages.Tickets.getSalesStatuses)
    getSalesStatuses(@Payload() showtimeIds: string[]) {
        return this.service.getSalesStatuses(showtimeIds)
    }

    @MessagePattern(Messages.Tickets.getTickets)
    getTickets(@Payload() ticketIds: string[]) {
        return this.service.getTickets(ticketIds)
    }
}
