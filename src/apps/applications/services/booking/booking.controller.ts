import { Controller } from '@nestjs/common'
import { MessagePattern, Payload } from '@nestjs/microservices'
import { Messages } from 'shared'
import { BookingService } from './booking.service'
import { SearchShowingTheatersDto, SearchShowdatesDto, SearchShowtimesDto } from './dtos'
import { HoldTicketsDto } from 'apps/cores'

@Controller()
export class BookingController {
    constructor(private service: BookingService) {}

    @MessagePattern(Messages.Booking.searchShowingTheaters)
    searchShowingTheaters(@Payload() dto: SearchShowingTheatersDto) {
        return this.service.searchShowingTheaters(dto)
    }

    @MessagePattern(Messages.Booking.searchShowdates)
    searchShowdates(@Payload() dto: SearchShowdatesDto) {
        return this.service.searchShowdates(dto)
    }

    @MessagePattern(Messages.Booking.searchShowtimes)
    searchShowtimes(@Payload() dto: SearchShowtimesDto) {
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
