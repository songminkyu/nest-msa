import { PaymentsClient } from 'apps/infrastructures'
import { closeFixture, createPaymentDto, Fixture } from './payments.fixture'

describe('Payments Module', () => {
    let fixture: Fixture
    let paymentsClient: PaymentsClient

    beforeEach(async () => {
        const { createFixture } = await import('./payments.fixture')

        fixture = await createFixture()
        paymentsClient = fixture.paymentsClient
    })

    afterEach(async () => {
        await closeFixture(fixture)
    })

    it('processPayment', async () => {
        const { createDto, expectedDto } = createPaymentDto()

        const payment = await paymentsClient.processPayment(createDto)
        expect(payment).toEqual(expectedDto)
    })

    it('getPayment', async () => {
        const { createDto } = createPaymentDto()
        const createdPayment = await paymentsClient.processPayment(createDto)

        const gotPayment = await paymentsClient.getPayment(createdPayment.id)
        expect(gotPayment).toEqual(createdPayment)
    })
})
