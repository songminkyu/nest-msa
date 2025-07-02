import { MovieDto, Seatmap, ShowtimeDto, TheaterDto } from 'apps/cores'
import { DateUtil } from 'common'
import {
    buildShowtimeCreateDto,
    buildTicketCreateDto,
    createCustomerAndLogin,
    createMovie,
    createShowtimes,
    createTheater,
    createTickets
} from './common.fixture'
import { CommonFixture, createCommonFixture } from './helpers'

const createTheaters = async (fix: CommonFixture) => {
    const theaters = await Promise.all([
        createTheater(fix, { location: { latitude: 30.0, longitude: 130.0 } }),
        createTheater(fix, { location: { latitude: 31.0, longitude: 131.0 } }),
        createTheater(fix, { location: { latitude: 32.0, longitude: 132.0 } }),
        createTheater(fix, { location: { latitude: 33.0, longitude: 133.0 } }),
        createTheater(fix, { location: { latitude: 34.0, longitude: 134.0 } })
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
            const { createDto } = buildShowtimeCreateDto({
                movieId: movie.id,
                theaterId: theater.id,
                startTime,
                endTime: DateUtil.addMinutes(startTime, 1)
            })
            return createDto
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

        return Seatmap.getAllSeats(theater.seatmap).map((seat) => {
            const { createDto } = buildTicketCreateDto({ movieId, theaterId, showtimeId, seat })
            return createDto
        })
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
