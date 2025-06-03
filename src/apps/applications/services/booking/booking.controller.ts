import { Controller } from '@nestjs/common'
import { MessagePattern, Payload } from '@nestjs/microservices'
import { Messages } from 'shared'
import { BookingService } from './booking.service'
import { FindShowingTheatersDto, FindShowdatesDto, FindShowtimesDto } from './dtos'
import { HoldTicketsDto } from 'apps/cores'

@Controller()
export class BookingController {
    constructor(private service: BookingService) {}

    @MessagePattern(Messages.Booking.searchShowingTheaters)
    searchShowingTheaters(@Payload() dto: FindShowingTheatersDto) {
        return this.service.searchShowingTheaters(dto)
    }

    @MessagePattern(Messages.Booking.searchShowdates)
    searchShowdates(@Payload() dto: FindShowdatesDto) {
        return this.service.searchShowdates(dto)
    }

    @MessagePattern(Messages.Booking.searchShowtimes)
    searchShowtimes(@Payload() dto: FindShowtimesDto) {
        return this.service.searchShowtimes(dto)
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
