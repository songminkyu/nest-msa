import { omit } from 'lodash'
import { CommonFixture, createCommonFixture } from './utils'
import { CustomerJwtAuthGuard } from 'apps/gateway'

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

export class Fixture extends CommonFixture {
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
