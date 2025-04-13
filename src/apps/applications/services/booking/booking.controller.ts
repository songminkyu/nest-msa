import { Controller } from '@nestjs/common'
import { MessagePattern, Payload } from '@nestjs/microservices'
import { Messages } from 'shared'
import { BookingService } from './booking.service'
import { FindShowingTheatersDto, FindShowdatesDto, FindShowtimesDto } from './dtos'
import { HoldTicketsDto } from 'apps/cores'

@Controller()
export class BookingController {
    constructor(private service: BookingService) {}

    @MessagePattern(Messages.Booking.findShowingTheaters)
    findShowingTheaters(@Payload() dto: FindShowingTheatersDto) {
        return this.service.findShowingTheaters(dto)
    }

    @MessagePattern(Messages.Booking.findShowdates)
    findShowdates(@Payload() dto: FindShowdatesDto) {
        return this.service.findShowdates(dto)
    }

    @MessagePattern(Messages.Booking.findShowtimes)
    findShowtimes(@Payload() dto: FindShowtimesDto) {
        return this.service.findShowtimes(dto)
    }

    @MessagePattern(Messages.Booking.getAvailableTickets)
    getAvailableTickets(@Payload() showtimeId: string) {
        return this.service.getAvailableTickets(showtimeId)
    }

    @MessagePattern(Messages.Booking.holdTickets)
    holdTickets(@Payload() dto: HoldTicketsDto) {
        return this.service.holdTickets(dto)
    }
}
