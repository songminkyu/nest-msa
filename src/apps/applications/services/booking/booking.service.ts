import { Injectable } from '@nestjs/common'
import {
    HoldTicketsDto,
    ShowtimesClient,
    TheatersClient,
    TicketHoldingClient,
    TicketsClient
} from 'apps/cores'
import { pickIds } from 'common'
import { generateShowtimesWithSalesStatus, sortTheatersByDistance } from './booking.utils'
import {
    FindShowdatesDto,
    FindShowingTheatersDto,
    FindShowtimesDto,
    ShowtimeSalesStatusDto
} from './dtos'

@Injectable()
export class BookingService {
    constructor(
        private showtimesService: ShowtimesClient,
        private theatersService: TheatersClient,
        private ticketHoldingService: TicketHoldingClient,
        private ticketsService: TicketsClient
    ) {}

    async searchShowingTheaters({ movieId, latlong }: FindShowingTheatersDto) {
        const theaterIds = await this.showtimesService.searchTheaterIds({ movieIds: [movieId] })
        const theaters = await this.theatersService.getTheaters(theaterIds)
        const showingTheaters = sortTheatersByDistance(theaters, latlong)

        return showingTheaters
    }

    async searchShowdates({ movieId, theaterId }: FindShowdatesDto) {
        return this.showtimesService.searchShowdates({
            movieIds: [movieId],
            theaterIds: [theaterId]
        })
    }

    async searchShowtimes({ movieId, theaterId, showdate }: FindShowtimesDto) {
        const startOfDay = new Date(showdate)
        startOfDay.setHours(0, 0, 0, 0)

        const endOfDay = new Date(showdate)
        endOfDay.setHours(23, 59, 59, 999)

        const showtimes = await this.showtimesService.searchShowtimes({
            movieIds: [movieId],
            theaterIds: [theaterId],
            startTimeRange: { start: startOfDay, end: endOfDay }
        })

        const ids = pickIds(showtimes)
        const salesStatuses = await this.ticketsService.getSalesStatuses(ids)

        const showtimesWithSalesStatus = generateShowtimesWithSalesStatus(showtimes, salesStatuses)

        return showtimesWithSalesStatus as ShowtimeSalesStatusDto[]
    }

    async getAvailableTickets(showtimeId: string) {
        const tickets = await this.ticketsService.searchTickets({ showtimeIds: [showtimeId] })
        return tickets
    }

    async holdTickets(dto: HoldTicketsDto) {
        const success = await this.ticketHoldingService.holdTickets(dto)
        return { success }
    }
}
