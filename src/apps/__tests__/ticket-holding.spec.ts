import { generateShortId, sleep } from 'common'
import { testObjectId } from 'testlib'
import { findHeldTicketIds, Fixture, holdTickets, releaseTickets } from './ticket-holding.fixture'

describe('Ticket Holding', () => {
    let fix: Fixture

    const customerId = testObjectId(0x1)
    const customerB = testObjectId(0x2)

    beforeEach(async () => {
        const { createFixture } = await import('./ticket-holding.fixture')
        fix = await createFixture()
    })

    afterEach(async () => {
        await fix?.teardown()
    })

    describe('holdTickets', () => {
        it('티켓을 정해진 시간 동안 선점해야 한다', async () => {
            const firstResult = await holdTickets(fix, { customerId })
            expect(firstResult).toBeTruthy()

            const secondResult = await holdTickets(fix, { customerId: customerB })
            expect(secondResult).toBeFalsy()
        })

        it('고객은 자신이 선점한 티켓을 다시 선점할 수 있다', async () => {
            const firstResult = await holdTickets(fix, { customerId })
            expect(firstResult).toBeTruthy()

            const secondResult = await holdTickets(fix, { customerId })
            expect(secondResult).toBeTruthy()
        })

        it('시간이 만료되면 티켓을 다시 선점할 수 있어야 한다', async () => {
            const { Rules } = await import('shared')
            const holdDuration = 1000
            Rules.Ticket.holdExpirationTime = holdDuration

            const initialResult = await holdTickets(fix, { customerId })
            expect(initialResult).toBeTruthy()

            await sleep(holdDuration + 500)

            const postExpiryResult = await holdTickets(fix, { customerId: customerB })
            expect(postExpiryResult).toBeTruthy()
        })

        it('동일한 고객이 새로운 티켓을 선점할 때 기존 티켓은 해제되어야 한다', async () => {
            const firstTickets = [testObjectId(0x30), testObjectId(0x31)]
            const newTickets = [testObjectId(0x40), testObjectId(0x41)]

            const holdA1 = await holdTickets(fix, { customerId, ticketIds: firstTickets })
            expect(holdA1).toBeTruthy()

            const holdA2 = await holdTickets(fix, { customerId, ticketIds: newTickets })
            expect(holdA2).toBeTruthy()

            const holdB = await holdTickets(fix, { customerId: customerB, ticketIds: firstTickets })
            expect(holdB).toBeTruthy()
        })

        it(
            '티켓이 중복 선점되면 안 된다',
            async () => {
                const results = await Promise.all(
                    Array.from({ length: 100 }, async () => {
                        const showtimeId = generateShortId()
                        const ticketIds = Array.from({ length: 5 }, generateShortId)
                        const customers = Array.from({ length: 10 }, generateShortId)

                        await Promise.all(
                            customers.map((customer) =>
                                holdTickets(fix, { customerId: customer, showtimeId, ticketIds })
                            )
                        )

                        const findResults = await Promise.all(
                            customers.map((customer) =>
                                fix.ticketHoldingClient.findHeldTicketIds(showtimeId, customer)
                            )
                        )

                        return findResults.flat().length === ticketIds.length
                    })
                )

                const allTrue = results.every((value) => value === true)
                expect(allTrue).toBeTruthy()
            },
            30 * 1000
        )
    })

    describe('findHeldTicketIds', () => {
        const ticketIds = [testObjectId(0x30), testObjectId(0x31)]
        const showtimeId = testObjectId(0x1)

        it('선점한 티켓을 반환해야 한다', async () => {
            await holdTickets(fix, { showtimeId, customerId, ticketIds })
            const heldTickets = await findHeldTicketIds(fix, showtimeId, customerId)
            expect(heldTickets).toEqual(ticketIds)
        })

        it('만료된 티켓은 반환되지 않아야 한다', async () => {
            const { Rules } = await import('shared')
            const holdDuration = 1000
            Rules.Ticket.holdExpirationTime = holdDuration

            await holdTickets(fix, { customerId, ticketIds })

            await sleep(holdDuration + 500)

            const heldTickets = await findHeldTicketIds(fix, showtimeId, customerId)
            expect(heldTickets).toEqual([])
        })
    })

    describe('releaseTickets', () => {
        const ticketIds = [testObjectId(0x30), testObjectId(0x31)]
        const showtimeId = testObjectId(0x1)

        it('고객이 선점한 티켓을 해제해야 한다', async () => {
            await holdTickets(fix, {
                customerId,
                showtimeId,
                ticketIds
            })

            const releaseRes = await releaseTickets(fix, showtimeId, customerId)
            expect(releaseRes).toBeTruthy()

            const heldTickets = await findHeldTicketIds(fix, showtimeId, customerId)
            expect(heldTickets).toEqual([])

            const secondResult = await holdTickets(fix, { customerId: customerB, ticketIds })
            expect(secondResult).toBeTruthy()
        })
    })
})
