import { PurchaseDto, PurchaseItemDto, PurchaseItemType, TicketDto, TicketStatus } from 'apps/cores'
import { Rules } from 'shared'
import { nullObjectId } from 'testlib'
import { Fixture, setupPurchaseData } from './purchases.fixture'
import { Errors } from './utils'

/* 구매 통합 테스트 */
describe('Purchases Integration Tests', () => {
    const totalPrice = 1
    let fix: Fixture

    beforeEach(async () => {
        const { createFixture } = await import('./purchases.fixture')
        fix = await createFixture()
    })

    afterEach(async () => {
        await fix?.teardown()
    })

    describe('POST /purchases', () => {
        let purchase: PurchaseDto
        let tickets: TicketDto[]
        let purchaseItems: PurchaseItemDto[]

        beforeEach(async () => {
            const data = await setupPurchaseData(fix)
            tickets = data.tickets
            purchaseItems = data.purchaseItems

            const { body } = await fix.httpClient
                .post('/purchases')
                .body({ customerId: fix.customer.id, totalPrice, purchaseItems })
                .created()

            purchase = body
        })

        it('구매 요청을 성공적으로 처리해야 한다', async () => {
            expect(purchase).toEqual({
                id: expect.any(String),
                createdAt: expect.any(Date),
                updatedAt: expect.any(Date),
                paymentId: expect.any(String),
                customerId: fix.customer.id,
                totalPrice,
                purchaseItems
            })
        })

        it('결제 정보를 조회할 수 있어야 한다', async () => {
            const payments = await fix.paymentsService.getPayments([purchase.paymentId])
            expect(payments[0].amount).toEqual(purchase.totalPrice)
        })

        it('구매한 티켓은 sold 상태여야 한다', async () => {
            const ticketIds = purchaseItems.map((item) => item.ticketId)
            const gotTickets = await fix.ticketsService.getTickets(ticketIds)
            gotTickets.forEach((ticket) => expect(ticket.status).toBe(TicketStatus.sold))
        })

        it('구매하지 않은 티켓은 available 상태여야 한다', async () => {
            const ticketIds = tickets.slice(4).map((ticket) => ticket.id)
            const gotTickets = await fix.ticketsService.getTickets(ticketIds)
            gotTickets.forEach((ticket) => expect(ticket.status).toBe(TicketStatus.available))
        })
    })

    describe('GET /purchases/:purchaseId', () => {
        let purchase: PurchaseDto

        beforeEach(async () => {
            purchase = await fix.purchasesService.createPurchase({
                customerId: fix.customer.id,
                totalPrice,
                purchaseItems: [{ type: PurchaseItemType.ticket, ticketId: nullObjectId }]
            })
        })

        it('구매 정보를 조회해야 한다', async () => {
            await fix.httpClient.get(`/purchases/${purchase.id}`).ok(purchase)
        })
    })

    describe('구매 가능 확인', () => {
        it('최대 구매 수량을 초과하면 BAD_REQUEST(400)를 반환해야 한다', async () => {
            const { purchaseItems } = await setupPurchaseData(fix, {
                itemCount: Rules.Ticket.maxTicketsPerPurchase + 1
            })

            await fix.httpClient
                .post('/purchases')
                .body({ customerId: fix.customer.id, totalPrice, purchaseItems })
                .badRequest({ ...Errors.Purchase.MaxTicketsExceeded, maxCount: expect.any(Number) })
        })

        it('구매 가능 시간을 초과하면 BAD_REQUEST(400)를 반환해야 한다', async () => {
            const { purchaseItems } = await setupPurchaseData(fix, {
                minutesFromNow: Rules.Ticket.purchaseDeadlineMinutes
            })

            await fix.httpClient
                .post('/purchases')
                .body({ customerId: fix.customer.id, totalPrice, purchaseItems })
                .badRequest({
                    ...Errors.Purchase.DeadlineExceeded,
                    deadlineMinutes: expect.any(Number),
                    cutoffTime: expect.any(String),
                    startTime: expect.any(String)
                })
        })

        it('선점되지 않은 티켓을 구매하려하면 BAD_REQUEST(400)를 반환해야 한다', async () => {
            const { showtime, purchaseItems } = await setupPurchaseData(fix)
            await fix.ticketHoldingClient.releaseTickets(showtime.id, fix.customer.id)

            await fix.httpClient
                .post('/purchases')
                .body({ customerId: fix.customer.id, totalPrice, purchaseItems })
                .badRequest(Errors.Purchase.TicketNotHeld)
        })
    })

    describe('errors', () => {
        it('구매 완료 단계에서 오류가 발생하면 InternalServerError(500)를 반환해야 한다', async () => {
            const { purchaseItems } = await setupPurchaseData(fix)

            jest.spyOn(fix.ticketsService, 'updateTicketStatus').mockImplementationOnce(() => {
                throw new Error('purchase error')
            })

            const spyRollback = jest.spyOn(fix.ticketPurchaseProcessor, 'rollbackPurchase')

            await fix.httpClient
                .post('/purchases')
                .body({ customerId: fix.customer.id, totalPrice, purchaseItems })
                .internalServerError()

            expect(spyRollback).toHaveBeenCalledTimes(1)
        })
    })
})
