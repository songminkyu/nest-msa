import { Injectable } from '@nestjs/common'
import { HoldTicketsDto, TheaterDto, TicketDto } from 'apps/cores'
import { ClientProxyService, InjectClientProxy } from 'common'
import { Messages } from 'shared'
import {
    FindShowdatesDto,
    FindShowingTheatersDto,
    FindShowtimesDto,
    ShowtimeSalesStatusDto
} from './dtos'

@Injectable()
export class BookingClient {
    constructor(@InjectClientProxy() private proxy: ClientProxyService) {}

    searchShowingTheaters(dto: FindShowingTheatersDto): Promise<TheaterDto[]> {
        return this.proxy.getJson(Messages.Booking.searchShowingTheaters, dto)
    }

    searchShowdates(dto: FindShowdatesDto): Promise<Date[]> {
        return this.proxy.getJson(Messages.Booking.searchShowdates, dto)
    }

    searchShowtimes(dto: FindShowtimesDto): Promise<ShowtimeSalesStatusDto[]> {
        return this.proxy.getJson(Messages.Booking.searchShowtimes, dto)
    }

    getAvailableTickets(showtimeId: string): Promise<TicketDto[]> {
        return this.proxy.getJson(Messages.Booking.getAvailableTickets, showtimeId)
    }

    holdTickets(dto: HoldTicketsDto): Promise<{ success: boolean }> {
        return this.proxy.getJson(Messages.Booking.holdTickets, dto)
    }
}
