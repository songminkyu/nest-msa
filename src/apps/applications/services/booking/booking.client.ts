import { Injectable } from '@nestjs/common'
import { HoldTicketsDto, TheaterDto, TicketDto } from 'apps/cores'
import { ClientProxyService, InjectClientProxy } from 'common'
import { Messages } from 'shared'
import {
    SearchShowdatesDto,
    SearchShowingTheatersDto,
    SearchShowtimesDto,
    ShowtimeSalesStatusDto
} from './dtos'

@Injectable()
export class BookingClient {
    constructor(@InjectClientProxy() private proxy: ClientProxyService) {}

    searchShowingTheaters(dto: SearchShowingTheatersDto): Promise<TheaterDto[]> {
        return this.proxy.getJson(Messages.Booking.searchShowingTheaters, dto)
    }

    searchShowdates(dto: SearchShowdatesDto): Promise<Date[]> {
        return this.proxy.getJson(Messages.Booking.searchShowdates, dto)
    }

    searchShowtimes(dto: SearchShowtimesDto): Promise<ShowtimeSalesStatusDto[]> {
        return this.proxy.getJson(Messages.Booking.searchShowtimes, dto)
    }

    getAvailableTickets(showtimeId: string): Promise<TicketDto[]> {
        return this.proxy.getJson(Messages.Booking.getAvailableTickets, showtimeId)
    }

    holdTickets(dto: HoldTicketsDto): Promise<{ success: boolean }> {
        return this.proxy.getJson(Messages.Booking.holdTickets, dto)
    }
}
