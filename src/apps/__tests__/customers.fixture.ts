import { CustomerJwtAuthGuard } from 'apps/gateway'
import { omit } from 'lodash'
import { HttpTestClient } from 'testlib'
import { AllTestContexts, createAllTestContexts } from './utils'

export const createCustomerDto = (overrides = {}) => {
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

export const createCustomer = async ({ providers }: AllTestContexts, override = {}) => {
    const { createDto } = createCustomerDto(override)

    const customer = await providers.customersClient.createCustomer(createDto)
    return customer
}

export const createCustomers = async (
    testContext: AllTestContexts,
    length: number = 20,
    overrides = {}
) => {
    return Promise.all(
        Array.from({ length }, async (_, index) =>
            createCustomer(testContext, {
                name: `Customer-${index}`,
                email: `user-${index}@mail.com`,
                ...overrides
            })
        )
    )
}

export interface Fixture {
    testContext: AllTestContexts
    teardown: () => Promise<void>
    httpClient: HttpTestClient
}

export async function createFixture() {
    const testContext = await createAllTestContexts({
        http: { ignoreGuards: [CustomerJwtAuthGuard] }
    })

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
