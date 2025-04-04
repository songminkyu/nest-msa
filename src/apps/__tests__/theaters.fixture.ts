import { padNumber } from 'common'
import { HttpTestClient } from 'testlib'
import { AllTestContexts, createAllTestContexts } from './utils'
import { AllProviders } from './utils/clients'

export const createTheaterDto = (overrides = {}) => {
    const createDto = {
        name: `theater name`,
        latlong: { latitude: 38.123, longitude: 138.678 },
        seatmap: { blocks: [{ name: 'A', rows: [{ name: '1', seats: 'OOOOXXOOOO' }] }] },
        ...overrides
    }

    const expectedDto = { id: expect.any(String), ...createDto }

    return { createDto, expectedDto }
}

export const createTheater = async ({ providers }: AllTestContexts, override = {}) => {
    const { createDto } = createTheaterDto(override)

    const theater = await providers.theatersClient.createTheater(createDto)
    return theater
}

export const createTheaters = async (
    testContext: AllTestContexts,
    length: number = 20,
    overrides = {}
) => {
    return Promise.all(
        Array.from({ length }, async (_, index) =>
            createTheater(testContext, { name: `Theater-${padNumber(index, 3)}`, ...overrides })
        )
    )
}

export interface Fixture extends AllProviders {
    testContext: AllTestContexts
    teardown: () => Promise<void>
    httpClient: HttpTestClient
}

export async function createFixture() {
    const testContext = await createAllTestContexts()

    const teardown = async () => {
        await testContext?.close()
    }

    return {
        ...testContext.providers,
        testContext,
        teardown,
        httpClient: testContext.gatewayContext.httpClient
    }
}
