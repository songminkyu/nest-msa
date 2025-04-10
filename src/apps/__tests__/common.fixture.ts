import { MovieGenre, MovieRating } from 'apps/cores'
import { omit } from 'lodash'
import { CommonFixture, TestFiles } from './utils'

export async function createCustomerAndLogin(fix: CommonFixture) {
    const email = 'user@mail.com'
    const password = 'password'
    const customer = await createCustomer(fix, { email, password })

    const { accessToken } = await fix.customersClient.generateAuthTokens({
        customerId: customer.id,
        email
    })

    return { customer, accessToken }
}

export const biuldCustomerCreateDto = (overrides = {}) => {
    const createDto = {
        name: 'name',
        email: 'name@mail.com',
        birthdate: new Date('2020-12-12'),
        password: 'password',
        ...overrides
    }
    const expectedDto = { id: expect.any(String), ...omit(createDto, 'password') }
    return { createDto, expectedDto }
}

export const createCustomer = async (fix: CommonFixture, override = {}) => {
    const { createDto } = biuldCustomerCreateDto(override)

    const customer = await fix.customersClient.createCustomer(createDto)
    return customer
}

export const buildMovieCreateDto = (overrides = {}) => {
    const createDto = {
        title: `MovieTitle`,
        genre: [MovieGenre.Action],
        releaseDate: new Date('1900-01-01'),
        plot: `MoviePlot`,
        durationMinutes: 90,
        director: 'James Cameron',
        rating: MovieRating.PG,
        ...overrides
    }
    const expectedDto = { id: expect.any(String), images: expect.any(Array), ...createDto }
    return { createDto, expectedDto }
}

export const createMovie = async (fix: CommonFixture, override = {}) => {
    const { createDto } = buildMovieCreateDto(override)

    const movie = await fix.moviesClient.createMovie(createDto, [TestFiles.image])
    return movie
}

export const buildTheaterCreateDto = (overrides = {}) => {
    const createDto = {
        name: `theater name`,
        latlong: { latitude: 38.123, longitude: 138.678 },
        seatmap: { blocks: [{ name: 'A', rows: [{ name: '1', seats: 'OOOOXXOOOO' }] }] },
        ...overrides
    }
    const expectedDto = { id: expect.any(String), ...createDto }
    return { createDto, expectedDto }
}

export const createTheater = async (fix: CommonFixture, override = {}) => {
    const { createDto } = buildTheaterCreateDto(override)

    const theater = await fix.theatersClient.createTheater(createDto)
    return theater
}
