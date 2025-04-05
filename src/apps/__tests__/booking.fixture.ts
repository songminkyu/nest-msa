import { MovieDto, Seatmap, ShowtimeDto, TheaterDto, TicketStatus } from 'apps/cores'
import { DateUtil } from 'common'
import { nullObjectId } from 'testlib'
import { createCustomerAndLogin } from './customers-auth.fixture'
import { createMovie } from './movies.fixture'
import { createShowtimeDto, createShowtimes } from './showtimes.fixture'
import { createTheater } from './theaters.fixture'
import { createTickets } from './tickets.fixture'
import { CommonFixture, createCommonFixture } from './utils'

async function createAllTickets(
    fix: CommonFixture,
    theaters: TheaterDto[],
    showtimes: ShowtimeDto[]
) {
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

    await createTickets(fix, createTicketDtos)
}

async function createTheaters(fix: CommonFixture) {
    const theaters = await Promise.all([
        createTheater(fix, { latlong: { latitude: 30.0, longitude: 130.0 } }),
        createTheater(fix, { latlong: { latitude: 31.0, longitude: 131.0 } }),
        createTheater(fix, { latlong: { latitude: 32.0, longitude: 132.0 } }),
        createTheater(fix, { latlong: { latitude: 33.0, longitude: 133.0 } }),
        createTheater(fix, { latlong: { latitude: 34.0, longitude: 134.0 } }),
        createTheater(fix, { latlong: { latitude: 35.0, longitude: 135.0 } }),
        createTheater(fix, { latlong: { latitude: 36.0, longitude: 136.0 } }),
        createTheater(fix, { latlong: { latitude: 37.0, longitude: 137.0 } }),
        createTheater(fix, { latlong: { latitude: 38.0, longitude: 138.0 } })
    ])

    return theaters
}

// TODO function은 모두 arrow로 변경한다
async function createAllShowtimes(fix: CommonFixture, theaters: TheaterDto[], movie: MovieDto) {
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
    const showtimes = await createShowtimes(fix, showtimeDtos)
    return showtimes
}

export interface Fixture extends CommonFixture {
    teardown: () => Promise<void>
    movie: MovieDto
    accessToken: string
}

export const createFixture = async () => {
    const commonFixture = await createCommonFixture()

    const { accessToken } = await createCustomerAndLogin(commonFixture)
    const movie = await createMovie(commonFixture, {})
    const theaters = await createTheaters(commonFixture)
    const showtimes = await createAllShowtimes(commonFixture, theaters, movie)
    await createAllTickets(commonFixture, theaters, showtimes)

    const teardown = async () => {
        await commonFixture?.close()
    }

    return { ...commonFixture, teardown, movie, accessToken }
}
