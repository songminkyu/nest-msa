import { HttpTestClient } from 'testlib'
import { createCustomer } from './customers.fixture'
import { AllTestContexts, createAllTestContexts } from './utils'

// 이건 다른 곳에서 사용한다.
export async function createCustomerAndLogin(testContext: AllTestContexts) {
    const email = 'user@mail.com'
    const password = 'password'
    const customer = await createCustomer(testContext, { email, password })

    const { customersClient } = testContext.providers
    const authTokens = await customersClient.generateAuthTokens({ customerId: customer.id, email })
    const accessToken = authTokens.accessToken

    return { customer, accessToken }
}

export interface Fixture {
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
