import {
    CustomersService,
    MovieDto,
    MoviesService,
    Seatmap,
    ShowtimeDto,
    ShowtimesService,
    TheaterDto,
    TheatersService,
    TicketsService,
    TicketStatus
} from 'apps/cores'
import { DateUtil } from 'common'
import { HttpTestClient, nullObjectId } from 'testlib'
import { createCustomerAndLogin } from './customers-auth.fixture'
import { createMovie } from './movies.fixture'
import { createShowtimeDto, createShowtimes } from './showtimes.fixture'
import { createTheater } from './theaters.fixture'
import { createTickets } from './tickets.fixture'
import { AllTestContexts, createAllTestContexts } from './utils'

async function createAllTickets(
    { coresContext }: AllTestContexts,
    theaters: TheaterDto[],
    showtimes: ShowtimeDto[]
) {
    const ticketsService = coresContext.module.get(TicketsService)

    const theatersById = new Map(theaters.map((theater) => [theater.id, theater]))

    const createTicketDtos = showtimes.flatMap((showtime) => {
        const theater = theatersById.get(showtime.theaterId)!

        return Seatmap.getAllSeats(theater.seatmap).map((seat) => ({
            batchId: nullObjectId,
            movieId: showtime.movieId,
            theaterId: showtime.theaterId,
            showtimeId: showtime.id,
            status: TicketStatus.available,
            seat
        }))
    })

    await createTickets(ticketsService, createTicketDtos)
}

async function createTheaters(testContext: AllTestContexts) {

    const theaters = await Promise.all([
        createTheater(testContext, { latlong: { latitude: 30.0, longitude: 130.0 } }),
        createTheater(testContext, { latlong: { latitude: 31.0, longitude: 131.0 } }),
        createTheater(testContext, { latlong: { latitude: 32.0, longitude: 132.0 } }),
        createTheater(testContext, { latlong: { latitude: 33.0, longitude: 133.0 } }),
        createTheater(testContext, { latlong: { latitude: 34.0, longitude: 134.0 } }),
        createTheater(testContext, { latlong: { latitude: 35.0, longitude: 135.0 } }),
        createTheater(testContext, { latlong: { latitude: 36.0, longitude: 136.0 } }),
        createTheater(testContext, { latlong: { latitude: 37.0, longitude: 137.0 } }),
        createTheater(testContext, { latlong: { latitude: 38.0, longitude: 138.0 } })
    ])

    return theaters
}

async function createAllShowtimes(
    { coresContext }: AllTestContexts,
    theaters: TheaterDto[],
    movie: MovieDto
) {
    const showtimesService = coresContext.module.get(ShowtimesService)

    const startTimes = [
        new Date('2999-01-01T12:00'),
        new Date('2999-01-01T14:00'),
        new Date('2999-01-03T12:00'),
        new Date('2999-01-03T14:00'),
        new Date('2999-01-02T12:00'),
        new Date('2999-01-02T14:00')
    ]
    const showtimeDtos = theaters.slice(0, 5).flatMap((theater) =>
        startTimes.map((startTime) =>
            createShowtimeDto({
                movieId: movie.id,
                theaterId: theater.id,
                startTime,
                endTime: DateUtil.addMinutes(startTime, 90)
            })
        )
    )
    const showtimes = await createShowtimes(showtimesService, showtimeDtos)
    return showtimes
}

async function login({ coresContext }: AllTestContexts) {
    const customersService = coresContext.module.get(CustomersService)
    const { accessToken } = await createCustomerAndLogin(customersService)
    return accessToken
}

export interface Fixture {
    teardown: () => Promise<void>
    httpClient: HttpTestClient
    movie: MovieDto
    accessToken: string
}

export async function createFixture() {
    const testContext = await createAllTestContexts()

    const accessToken = await login(testContext)
    const movie = await createMovie(testContext, {})
    const theaters = await createTheaters(testContext)
    const showtimes = await createAllShowtimes(testContext, theaters, movie)
    await createAllTickets(testContext, theaters, showtimes)

    const teardown = async () => {
        await testContext?.close()
    }

    return { teardown, httpClient: testContext.gatewayContext.httpClient, movie, accessToken }
}
