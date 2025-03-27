import { Injectable } from '@nestjs/common'
import { TheaterDto, TicketDto } from 'apps/cores'
import { ClientProxyService, InjectClientProxy, LatLong } from 'common'
import { Messages } from 'shared'
import { ShowtimeSalesStatusDto } from './dtos'

@Injectable()
export class BookingClient {
    constructor(@InjectClientProxy() private proxy: ClientProxyService) {}

    findShowingTheaters(args: { movieId: string; latlong: LatLong }): Promise<TheaterDto[]> {
        return this.proxy.getJson(Messages.Booking.findShowingTheaters, args)
    }

    findShowdates(args: { movieId: string; theaterId: string }): Promise<Date[]> {
        return this.proxy.getJson(Messages.Booking.findShowdates, args)
    }

    findShowtimes(args: {
        movieId: string
        theaterId: string
        showdate: Date
    }): Promise<ShowtimeSalesStatusDto[]> {
        return this.proxy.getJson(Messages.Booking.findShowtimes, args)
    }

    getAvailableTickets(showtimeId: string): Promise<TicketDto[]> {
        return this.proxy.getJson(Messages.Booking.getAvailableTickets, showtimeId)
    }

    holdTickets(args: { customerId: string; showtimeId: string; ticketIds: string[] }): Promise<{
        heldTicketIds: string[]
    }> {
        return this.proxy.getJson(Messages.Booking.holdTickets, args)
    }
}
