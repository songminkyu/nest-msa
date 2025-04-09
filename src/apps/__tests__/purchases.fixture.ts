import {
    CustomerDto,
    MovieDto,
    PurchaseItemType,
    Seatmap,
    ShowtimeDto,
    TheaterDto,
    TicketDto,
    TicketStatus
} from 'apps/cores'
import { DateTimeRange, DateUtil, pickIds } from 'common'
import { createCustomer } from './customers.fixture'
import { createMovie } from './movies.fixture'
import { buildShowtimeCreateDto, createShowtimes } from './showtimes.fixture'
import { createTheater } from './theaters.fixture'
import { buildTicketCreateDto, createTickets } from './tickets.fixture'
import { CommonFixture, createCommonFixture } from './utils'
import { Rules } from 'shared'

const createShowtime = async (fix: Fixture, startTime: Date) => {
    const showtimeCreateDto = buildShowtimeCreateDto({
        movieId: fix.movie.id,
        theaterId: fix.theater.id,
        timeRange: DateTimeRange.create({ start: startTime, minutes: 1 })
    })

    const showtimes = await createShowtimes(fix, [showtimeCreateDto])
    return showtimes[0]
}

const createAllTickets = async (fix: Fixture, showtime: ShowtimeDto) => {
    const ticketCreateDtos = Seatmap.getAllSeats(fix.theater.seatmap).map((seat) =>
        buildTicketCreateDto({
            movieId: showtime.movieId,
            theaterId: showtime.theaterId,
            showtimeId: showtime.id,
            status: TicketStatus.available,
            seat
        })
    )

    const tickets = await createTickets(fix, ticketCreateDtos)
    return tickets
}

const holdTickets = async (fix: Fixture, showtimeId: string, tickets: TicketDto[]) => {
    await fix.ticketHoldingService.holdTickets({
        customerId: fix.customer.id,
        showtimeId,
        ticketIds: pickIds(tickets)
    })
}

export const setupPurchaseData = async (
    fix: Fixture,
    opts?: { itemCount?: number; minutesFromNow?: number }
) => {
    const {
        itemCount = Rules.Ticket.maxTicketsPerPurchase,
        minutesFromNow = Rules.Ticket.purchaseDeadlineMinutes + 1
    } = opts || {}

    const showtime = await createShowtime(fix, DateUtil.addMinutes(new Date(), minutesFromNow))

    const tickets = await createAllTickets(fix, showtime)

    const heldTickets = tickets.slice(0, itemCount)

    await holdTickets(fix, showtime.id, heldTickets)

    const purchaseItems = heldTickets.map((ticket) => ({
        type: PurchaseItemType.ticket,
        ticketId: ticket.id
    }))

    return { showtime, tickets, purchaseItems }
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
