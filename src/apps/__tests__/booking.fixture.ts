// TODO function은 모두 arrow로 변경한다
import { MovieDto, Seatmap, ShowtimeDto, TheaterDto } from 'apps/cores'
import { DateUtil } from 'common'
import { createCustomerAndLogin } from './customers-auth.fixture'
import { createMovie } from './movies.fixture'
import { buildShowtimeCreateDto, createShowtimes } from './showtimes.fixture'
import { createTheater } from './theaters.fixture'
import { buildTicketCreateDto, createTickets } from './tickets.fixture'
import { CommonFixture, createCommonFixture } from './utils'

const createTheaters = async (fix: CommonFixture) => {
    const theaters = await Promise.all([
        createTheater(fix, { latlong: { latitude: 30.0, longitude: 130.0 } }),
        createTheater(fix, { latlong: { latitude: 31.0, longitude: 131.0 } }),
        createTheater(fix, { latlong: { latitude: 32.0, longitude: 132.0 } }),
        createTheater(fix, { latlong: { latitude: 33.0, longitude: 133.0 } }),
        createTheater(fix, { latlong: { latitude: 34.0, longitude: 134.0 } })
    ])

    return theaters
}

const createAllShowtimes = async (fix: CommonFixture, theaters: TheaterDto[], movie: MovieDto) => {
    const startTimes = [
        new Date('2999-01-01T12:00'),
        new Date('2999-01-01T14:00'),
        new Date('2999-01-03T12:00'),
        new Date('2999-01-02T14:00')
    ]

    const showtimeCreateDtos = theaters.flatMap((theater) =>
        startTimes.map((startTime) => {
            const movieId = movie.id
            const theaterId = theater.id
            const endTime = DateUtil.addMinutes(startTime, 90)

            return buildShowtimeCreateDto({ movieId, theaterId, startTime, endTime })
        })
    )

    const showtimes = await createShowtimes(fix, showtimeCreateDtos)
    return showtimes
}

const createAllTickets = async (
    fix: CommonFixture,
    theaters: TheaterDto[],
    showtimes: ShowtimeDto[]
) => {
    const theatersById = new Map(theaters.map((theater) => [theater.id, theater]))

    const createTicketDtos = showtimes.flatMap(({ movieId, theaterId, id: showtimeId }) => {
        const theater = theatersById.get(theaterId)!

        return Seatmap.getAllSeats(theater.seatmap).map((seat) =>
            buildTicketCreateDto({ movieId, theaterId, showtimeId, seat })
        )
    })

    await createTickets(fix, createTicketDtos)
}

export interface Fixture extends CommonFixture {
    teardown: () => Promise<void>
    movie: MovieDto
    accessToken: string
}

export const createFixture = async () => {
    const commonFixture = await createCommonFixture()

    const { accessToken } = await createCustomerAndLogin(commonFixture)

    const theaters = await createTheaters(commonFixture)
    const movie = await createMovie(commonFixture)
    const showtimes = await createAllShowtimes(commonFixture, theaters, movie)
    await createAllTickets(commonFixture, theaters, showtimes)

    const teardown = async () => {
        await commonFixture?.close()
    }

    return { ...commonFixture, teardown, movie, accessToken }
}
