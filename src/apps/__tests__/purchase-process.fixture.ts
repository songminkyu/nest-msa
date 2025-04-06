import {
    CustomerDto,
    MovieDto,
    PurchaseCreateDto,
    PurchaseItemType,
    Seatmap,
    ShowtimeDto,
    TheaterDto,
    TicketDto,
    TicketStatus
} from 'apps/cores'
import { DateUtil, pickIds } from 'common'
import { nullObjectId } from 'testlib'
import { createCustomer } from './customers.fixture'
import { createMovie } from './movies.fixture'
import { buildShowtimeCreateDto, createShowtimes } from './showtimes.fixture'
import { createTheater } from './theaters.fixture'
import { buildCreateTicketDto, createTickets } from './tickets.fixture'
import { CommonFixture, createCommonFixture } from './utils'

export const createShowtime = async (
    fix: CommonFixture,
    movie: MovieDto,
    theater: TheaterDto,
    startTime: Date
) => {
    const createDto = buildShowtimeCreateDto({
        movieId: movie.id,
        theaterId: theater.id,
        startTime,
        endTime: DateUtil.addMinutes(startTime, 90)
    })
    const showtimes = await createShowtimes(fix, [createDto])
    return showtimes[0]
}

export const createAllTickets = async (
    fix: CommonFixture,
    theater: TheaterDto,
    showtime: ShowtimeDto
) => {
    const createDtos = Seatmap.getAllSeats(theater.seatmap).map((seat) =>
        buildCreateTicketDto({
            movieId: showtime.movieId,
            theaterId: showtime.theaterId,
            showtimeId: showtime.id,
            status: TicketStatus.available,
            seat
        })
    )

    const tickets = await createTickets(fix, createDtos)
    return tickets
}

export const createPurchase = async (fix: CommonFixture, override: Partial<PurchaseCreateDto>) => {
    const createDto = {
        customerId: nullObjectId,
        totalPrice: 1000,
        items: [{ type: PurchaseItemType.ticket, ticketId: nullObjectId }],
        ...override
    } as PurchaseCreateDto

    return fix.purchasesService.createPurchase(createDto)
}

export const holdTickets = async (fixture: Fixture, showtimeId: string, tickets: TicketDto[]) => {
    await fixture.ticketHoldingService.holdTickets({
        customerId: fixture.customer.id,
        showtimeId,
        ticketIds: pickIds(tickets)
    })
}

export interface Fixture extends CommonFixture {
    teardown: () => Promise<void>
    customer: CustomerDto
    movie: MovieDto
    theater: TheaterDto
}

export const createFixture = async () => {
    const commonFixture = await createCommonFixture()

    const customer = await createCustomer(commonFixture)
    const movie = await createMovie(commonFixture)
    const theater = await createTheater(commonFixture, {
        seatmap: { blocks: [{ name: 'A', rows: [{ name: '1', seats: 'OOOOOOOOOOOO' }] }] }
    })

    const teardown = async () => {
        await commonFixture?.close()
    }

    return { ...commonFixture, teardown, customer, movie, theater }
}
