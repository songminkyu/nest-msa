import { Module } from '@nestjs/common'
import { ShowtimesClient, TheatersClient, TicketHoldingClient, TicketsClient } from 'apps/cores'
import { BookingController } from './booking.controller'
import { BookingService } from './booking.service'

@Module({
    providers: [
        BookingService,
        ShowtimesClient,
        TheatersClient,
        TicketHoldingClient,
        TicketsClient
    ],
    controllers: [BookingController]
})
export class BookingModule {}
