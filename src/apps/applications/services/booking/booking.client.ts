import { Injectable } from '@nestjs/common'
import { HoldTicketsDto, TheaterDto, TicketDto } from 'apps/cores'
import { ClientProxyService, InjectClientProxy } from 'common'
import { Messages } from 'shared'
import {
    SearchShowdatesDto,
    SearchShowingTheatersDto,
    SearchShowtimesDto,
    ShowtimeForBooking
} from './dtos'

@Injectable()
export class BookingClient {
    constructor(@InjectClientProxy() private proxy: ClientProxyService) {}

    searchTheaters(dto: SearchShowingTheatersDto): Promise<TheaterDto[]> {
        return this.proxy.getJson(Messages.Booking.searchTheaters, dto)
    }

    searchShowdates(dto: SearchShowdatesDto): Promise<Date[]> {
        return this.proxy.getJson(Messages.Booking.searchShowdates, dto)
    }

    searchShowtimes(dto: SearchShowtimesDto): Promise<ShowtimeForBooking[]> {
        return this.proxy.getJson(Messages.Booking.searchShowtimes, dto)
    }

    getTickets(showtimeId: string): Promise<TicketDto[]> {
        return this.proxy.getJson(Messages.Booking.getTickets, showtimeId)
    }

    holdTickets(dto: HoldTicketsDto): Promise<{ success: boolean }> {
        return this.proxy.getJson(Messages.Booking.holdTickets, dto)
    }
}
