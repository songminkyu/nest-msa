import { padNumber } from 'common'
import { CommonFixture, createCommonFixture } from './utils'
import { createTheater } from './common.fixture'

export const createTheaters = async (fix: CommonFixture, length: number = 20, overrides = {}) => {
    return Promise.all(
        Array.from({ length }, async (_, index) =>
            createTheater(fix, { name: `Theater-${padNumber(index, 3)}`, ...overrides })
        )
    )
}

export interface Fixture extends CommonFixture {
    teardown: () => Promise<void>
}

export const createFixture = async () => {
    const commonFixture = await createCommonFixture()

    const teardown = async () => {
        await commonFixture?.close()
    }

    return { ...commonFixture, teardown }
}
