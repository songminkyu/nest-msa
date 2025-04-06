import { padNumber } from 'common'
import { CommonFixture, createCommonFixture } from './utils'

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

export const createTheaters = async (fix: CommonFixture, length: number = 20, overrides = {}) => {
    return Promise.all(
        Array.from({ length }, async (_, index) =>
            createTheater(fix, { name: `Theater-${padNumber(index, 3)}`, ...overrides })
        )
    )
}

export class Fixture extends CommonFixture {
    teardown: () => Promise<void>
}

export const createFixture = async () => {
    const commonFixture = await createCommonFixture()

    const teardown = async () => {
        await commonFixture?.close()
    }

    return { ...commonFixture, teardown }
}
