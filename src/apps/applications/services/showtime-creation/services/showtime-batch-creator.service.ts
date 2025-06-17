import { Injectable } from '@nestjs/common'
import {
    Seatmap,
    ShowtimeDto,
    ShowtimesClient,
    TheaterDto,
    TheatersClient,
    TicketsClient,
    TicketStatus
} from 'apps/cores'
import { Assert, DateUtil } from 'common'
import { CreateShowtimeBatchDto } from '../dtos'

@Injectable()
export class ShowtimeBatchCreatorService {
    constructor(
        private theatersService: TheatersClient,
        private showtimesService: ShowtimesClient,
        private ticketsService: TicketsClient
    ) {}

    async create(createDto: CreateShowtimeBatchDto, transactionId: string) {
        const createdShowtimes = await this.createShowtimeBatch(createDto, transactionId)

        const createdTicketCount = await this.createTicketBatch(createdShowtimes, transactionId)

        return { createdShowtimeCount: createdShowtimes.length, createdTicketCount }
    }

    private async createShowtimeBatch(createDto: CreateShowtimeBatchDto, transactionId: string) {
        const { movieId, theaterIds, durationMinutes, startTimes } = createDto

        const createDtos = theaterIds.flatMap((theaterId) =>
            startTimes.map((startTime) => ({
                transactionId,
                movieId,
                theaterId,
                startTime,
                endTime: DateUtil.addMinutes(startTime, durationMinutes)
            }))
        )

        await this.showtimesService.createShowtimes(createDtos)
        const showtimes = await this.showtimesService.searchShowtimes({
            transactionIds: [transactionId]
        })
        return showtimes
    }

    private async createTicketBatch(showtimes: ShowtimeDto[], transactionId: string) {
        let totalCount = 0

        const theaterIds = Array.from(new Set(showtimes.map((showtime) => showtime.theaterId)))
        const theaters = await this.theatersService.getTheaters(theaterIds)

        const theatersById = new Map<string, TheaterDto>()
        theaters.forEach((theater) => theatersById.set(theater.id, theater))

        await Promise.all(
            showtimes.map(async (showtime) => {
                const theater = theatersById.get(showtime.theaterId)!

                Assert.defined(theater, 'The theater must exist.')

                const createTicketDtos = Seatmap.getAllSeats(theater.seatmap).map((seat) => ({
                    showtimeId: showtime.id,
                    theaterId: showtime.theaterId,
                    movieId: showtime.movieId,
                    status: TicketStatus.Available,
                    seat,
                    transactionId
                }))

                const { count } = await this.ticketsService.createTickets(createTicketDtos)
                totalCount += count
            })
        )

        return totalCount
    }
}
