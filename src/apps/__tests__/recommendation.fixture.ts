import { CustomerDto, MovieDto } from 'apps/cores'
import { nullObjectId } from 'testlib'
import { createCustomerAndLogin } from './customers-auth.fixture'
import { createMovie } from './movies.fixture'
import { createShowtimes } from './showtimes.fixture'
import { CommonFixture, createCommonFixture } from './utils'
import { DateTimeRange } from 'common'

export const createWatchedMovies = async (
    fix: CommonFixture,
    customer: CustomerDto,
    dtos: Partial<MovieDto>[]
) => {
    const watchedMovies = await Promise.all(
        dtos.map(async (dto) => {
            const movie = await createMovie(fix, dto)

            fix.watchRecordsService.createWatchRecord({
                customerId: customer.id,
                purchaseId: nullObjectId,
                watchDate: new Date(0),
                movieId: movie.id
            })

            return movie
        })
    )

    return watchedMovies
}

export const createShowingMovies = async (fix: CommonFixture, dtos: Partial<MovieDto>[]) => {
    const showingMovies = await Promise.all(dtos.map((dto) => createMovie(fix, dto)))

    const showtimesCreateDtos = showingMovies.map((movie) => ({
        movieId: movie.id,
        batchId: nullObjectId,
        theaterId: nullObjectId,
        timeRange: DateTimeRange.create({ start: new Date('2999-01-01'), days: 1 })
    }))

    await createShowtimes(fix, showtimesCreateDtos)

    return showingMovies
}

export interface Fixture extends CommonFixture {
    teardown: () => Promise<void>
    customer: CustomerDto
    accessToken: string
}

export const createFixture = async () => {
    const commonFixture = await createCommonFixture()

    const { customer, accessToken } = await createCustomerAndLogin(commonFixture)

    const teardown = async () => {
        await commonFixture?.close()
    }

    return { ...commonFixture, teardown, customer, accessToken }
}
