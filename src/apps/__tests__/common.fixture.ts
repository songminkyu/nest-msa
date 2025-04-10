import { createCustomer } from './customers.fixture'
import { CommonFixture } from './utils'

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
