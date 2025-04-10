import { CustomerJwtAuthGuard } from 'apps/gateway'
import { createCustomer } from './common.fixture'
import { CommonFixture, createCommonFixture } from './utils'

export const createCustomers = async (fix: CommonFixture, length: number = 20, overrides = {}) => {
    return Promise.all(
        Array.from({ length }, async (_, index) =>
            createCustomer(fix, {
                name: `Customer-${index}`,
                email: `user-${index}@mail.com`,
                ...overrides
            })
        )
    )
}

export interface Fixture extends CommonFixture {
    teardown: () => Promise<void>
}

export const createFixture = async () => {
    const commonFixture = await createCommonFixture({
        gateway: { ignoreGuards: [CustomerJwtAuthGuard] }
    })

    const teardown = async () => {
        await commonFixture?.close()
    }

    return { ...commonFixture, teardown }
}
