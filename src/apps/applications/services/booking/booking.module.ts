import { Module } from '@nestjs/common'
import { ShowtimesProxy, TheatersServiceProxy, TicketHoldingProxy, TicketsProxy } from 'apps/cores'
import { BookingController } from './booking.controller'
import { BookingService } from './booking.service'

@Module({
    providers: [BookingService, ShowtimesProxy, TheatersServiceProxy, TicketHoldingProxy, TicketsProxy],
    controllers: [BookingController]
})
export class BookingModule {}
