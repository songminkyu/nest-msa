import { buildCreatePaymentDto, Fixture } from './payments.fixture'

describe('Payments', () => {
    let fix: Fixture

    beforeEach(async () => {
        const { createFixture } = await import('./payments.fixture')
        fix = await createFixture()
    })

    afterEach(async () => {
        await fix?.teardown()
    })

    it('processPayment', async () => {
        const { createDto, expectedDto } = buildCreatePaymentDto()

        const payment = await fix.paymentsClient.processPayment(createDto)
        expect(payment).toEqual(expectedDto)
    })

    it('getPayments', async () => {
        const { createDto } = buildCreatePaymentDto()
        const createdPayment = await fix.paymentsClient.processPayment(createDto)

        const gotPayments = await fix.paymentsClient.getPayments([createdPayment.id])
        expect(gotPayments).toEqual([createdPayment])
    })
})
