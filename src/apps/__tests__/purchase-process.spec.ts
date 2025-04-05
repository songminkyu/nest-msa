import {
    PurchaseDto,
    PurchaseItemDto,
    PurchaseItemType,
    ShowtimeDto,
    TicketDto,
    TicketStatus
} from 'apps/cores'
import { DateUtil } from 'common'
import {
    createAllTickets,
    createPurchase,
    createShowtime,
    Fixture,
    holdTickets
} from './purchase-process.fixture'
import { Errors } from './utils'

describe('/purchase-process', () => {
    const totalPrice = 1000

    let fix: Fixture

    beforeEach(async () => {
        const { createFixture } = await import('./purchase-process.fixture')
        fix = await createFixture()
    })

    afterEach(async () => {
        await fix?.teardown()
    })

    describe('POST /purchases', () => {
        let purchase: PurchaseDto
        let tickets: TicketDto[]
        let showtime: ShowtimeDto
        let items: PurchaseItemDto[]

        beforeEach(async () => {
            showtime = await createShowtime(
                fix,
                fix.movie,
                fix.theater,
                DateUtil.addMinutes(new Date(), 120)
            )
            tickets = await createAllTickets(fix, fix.theater, showtime)
            items = tickets
                .slice(0, 4)
                .map((ticket) => ({ type: PurchaseItemType.ticket, ticketId: ticket.id }))

            await holdTickets(fix, showtime.id, tickets)

            const { body } = await fix.httpClient
                .post('/purchases')
                .body({ customerId: fix.customer.id, totalPrice, items })
                .created()

            purchase = body
        })

        it('구매 요청을 성공적으로 처리해야 한다', async () => {
            expect(purchase).toEqual({
                id: expect.any(String),
                paymentId: expect.any(String),
                createdAt: expect.any(Date),
                updatedAt: expect.any(Date),
                customerId: fix.customer.id,
                totalPrice,
                items
            })
        })

        it('결제 정보를 조회할 수 있어야 한다', async () => {
            const payments = await fix.paymentsService.getPayments([purchase.paymentId])
            expect(payments[0].amount).toEqual(purchase.totalPrice)
        })

        it('구매한 티켓은 sold 상태여야 한다', async () => {
            const ticketIds = items.map((item) => item.ticketId)
            const gotTickets = await fix.ticketsService.getTickets(ticketIds)
            gotTickets.forEach((ticket) => expect(ticket.status).toBe(TicketStatus.sold))
        })

        it('구매하지 않은 티켓은 available 상태여야 한다', async () => {
            const ticketIds = tickets.slice(4).map((ticket) => ticket.id)
            const gotTickets = await fix.ticketsService.getTickets(ticketIds)
            gotTickets.forEach((ticket) => expect(ticket.status).toBe(TicketStatus.available))
        })
    })

    describe('구매 가능 확인', () => {
        it('최대 구매 수량을 초과하면 BAD_REQUEST(400)를 반환해야 한다', async () => {
            const showtime = await createShowtime(
                fix,
                fix.movie,
                fix.theater,
                DateUtil.addMinutes(new Date(), 120)
            )
            const tickets = await createAllTickets(fix, fix.theater, showtime)
            const items = tickets.map((ticket) => ({
                type: PurchaseItemType.ticket,
                ticketId: ticket.id
            }))
            await holdTickets(fix, showtime.id, tickets)

            await fix.httpClient
                .post('/purchases')
                .body({ customerId: fix.customer.id, totalPrice, items })
                .badRequest({
                    ...Errors.Purchase.MaxTicketsExceeded,
                    maxCount: expect.any(Number)
                })
        })

        it('구매 가능 시간을 초과하면 BAD_REQUEST(400)를 반환해야 한다', async () => {
            const showtime = await createShowtime(fix, fix.movie, fix.theater, new Date(0))
            const tickets = await createAllTickets(fix, fix.theater, showtime)
            const items = [{ type: PurchaseItemType.ticket, ticketId: tickets[0].id }]
            await holdTickets(fix, showtime.id, tickets)

            await fix.httpClient
                .post('/purchases')
                .body({ customerId: fix.customer.id, totalPrice, items })
                .badRequest({
                    ...Errors.Purchase.DeadlineExceeded,
                    deadlineMinutes: expect.any(Number),
                    cutoffTime: expect.any(String),
                    startTime: expect.any(String)
                })
        })

        it('선점되지 않은 티켓을 구매하려하면 BAD_REQUEST(400)를 반환해야 한다', async () => {
            const showtime = await createShowtime(
                fix,
                fix.movie,
                fix.theater,
                DateUtil.addMinutes(new Date(), 120)
            )
            const tickets = await createAllTickets(fix, fix.theater, showtime)
            const items = [{ type: PurchaseItemType.ticket, ticketId: tickets[0].id }]

            await fix.httpClient
                .post('/purchases')
                .body({ customerId: fix.customer.id, totalPrice, items })
                .badRequest(Errors.Purchase.TicketNotHeld)
        })
    })

    describe('errors', () => {
        it('구매 완료 단계에서 오류가 발생하면 InternalServerError(500)를 반환해야 한다', async () => {
            const showtime = await createShowtime(
                fix,
                fix.movie,
                fix.theater,
                DateUtil.addMinutes(new Date(), 120)
            )
            const tickets = await createAllTickets(fix, fix.theater, showtime)
            const items = [{ type: PurchaseItemType.ticket, ticketId: tickets[0].id }]
            await holdTickets(fix, showtime.id, tickets)

            jest.spyOn(fix.ticketsService, 'updateTicketStatus').mockImplementationOnce(() => {
                throw new Error('purchase error')
            })

            const spyRollback = jest.spyOn(fix.ticketPurchaseProcessor, 'rollbackPurchase')

            await fix.httpClient
                .post('/purchases')
                .body({ customerId: fix.customer.id, totalPrice, items })
                .internalServerError()

            expect(spyRollback).toHaveBeenCalledTimes(1)
        })
    })

    describe('GET /purchases/:purchaseId', () => {
        let purchase: PurchaseDto

        beforeEach(async () => {
            purchase = await createPurchase(fix, {})
        })

        it('구매 정보를 조회할 수 있어야 한다', async () => {
            await fix.httpClient.get(`/purchases/${purchase.id}`).ok(purchase)
        })
    })
})
