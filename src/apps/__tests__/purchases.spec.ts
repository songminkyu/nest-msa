import { PurchaseDto, PurchaseItemType } from 'apps/cores'
import { nullObjectId } from 'testlib'
import { Fixture } from './purchases.fixture'

describe('Purchases Module', () => {
    let fix: Fixture

    let purchase: PurchaseDto
    const customerId = nullObjectId
    const totalPrice = 1000
    const items = [{ type: PurchaseItemType.ticket, ticketId: nullObjectId }]

    beforeEach(async () => {
        const { createFixture } = await import('./purchases.fixture')
        fix = await createFixture()

        purchase = await fix.purchasesService.createPurchase({ customerId, totalPrice, items })
    })

    afterEach(async () => {
        await fix?.teardown()
    })

    it('구매 요청을 성공적으로 처리해야 한다', async () => {
        expect(purchase).toEqual({
            id: expect.any(String),
            paymentId: expect.any(String),
            createdAt: expect.any(Date),
            updatedAt: expect.any(Date),
            customerId,
            totalPrice,
            items
        })
    })

    it('구매 정보를 조회해야 한다', async () => {
        const gotPurchases = await fix.purchasesService.getPurchases([purchase.id])
        expect(gotPurchases).toEqual([purchase])
    })

    it('결제 정보가 조회돼야 한다', async () => {
        const payments = await fix.paymentsService.getPayments([purchase.paymentId])
        expect(payments[0].amount).toEqual(purchase.totalPrice)
    })
})
