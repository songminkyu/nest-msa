import { PaymentsClient } from 'apps/infrastructures'
import { nullObjectId } from 'testlib'
import { AllTestContexts, createAllTestContexts } from './utils'

export interface Fixture {
    testContext: AllTestContexts
    paymentsClient: PaymentsClient
}

export async function createFixture() {
    const testContext = await createAllTestContexts()
    const coresModule = testContext.coresContext.module
    const paymentsClient = coresModule.get(PaymentsClient)

    return { testContext, paymentsClient }
}

export async function closeFixture(fixture: Fixture) {
    await fixture.testContext.close()
}

export const createPaymentDto = (overrides = {}) => {
    const createDto = { customerId: nullObjectId, amount: 1, ...overrides }

    const expectedDto = {
        id: expect.any(String),
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        ...createDto
    }

    return { createDto, expectedDto }
}
