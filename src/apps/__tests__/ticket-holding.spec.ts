import { generateShortId, sleep } from 'common'
import { Fixture } from './ticket-holding.fixture'

describe('TicketHolding Module', () => {
    let fix: Fixture

    const customerA = 'customerId#1'
    const customerB = 'customerId#2'
    const showtimeId = 'showtimeId#1'
    const ticketIds = ['ticketId#1', 'ticketId#2']

    beforeEach(async () => {
        const { createFixture } = await import('./ticket-holding.fixture')
        fix = await createFixture()
    })

    afterEach(async () => {
        await fix?.teardown()
    })

    it('test', async () => {
        console.log('------A')
    })

    describe('holdTickets', () => {
        it('티켓을 정해진 시간 동안 선점해야 한다', async () => {
            const firstResult = await fix.ticketHoldingClient.holdTickets({
                showtimeId,
                customerId: customerA,
                ticketIds
            })
            expect(firstResult).toBeTruthy()

            const secondResult = await fix.ticketHoldingClient.holdTickets({
                showtimeId,
                customerId: customerB,
                ticketIds
            })
            expect(secondResult).toBeFalsy()
        })

        it('고객은 자신이 선점한 티켓을 다시 선점할 수 있다', async () => {
            const firstResult = await fix.ticketHoldingClient.holdTickets({
                showtimeId,
                customerId: customerA,
                ticketIds
            })
            expect(firstResult).toBeTruthy()

            const secondResult = await fix.ticketHoldingClient.holdTickets({
                showtimeId,
                customerId: customerA,
                ticketIds
            })
            expect(secondResult).toBeTruthy()
        })

        it('시간이 만료되면 티켓을 다시 선점할 수 있어야 한다', async () => {
            const { Rules } = await import('shared')
            const holdDuration = 1000
            Rules.Ticket.holdExpirationTime = holdDuration

            const initialResult = await fix.ticketHoldingClient.holdTickets({
                showtimeId,
                customerId: customerA,
                ticketIds
            })
            expect(initialResult).toBeTruthy()

            await sleep(holdDuration + 500)

            const postExpiryResult = await fix.ticketHoldingClient.holdTickets({
                showtimeId,
                customerId: customerB,
                ticketIds
            })
            expect(postExpiryResult).toBeTruthy()
        })

        it('동일한 고객이 새로운 티켓을 선점할 때 기존 티켓은 해제되어야 한다', async () => {
            const firstTickets = ['ticketId#1', 'ticketId#2']
            const newTickets = ['ticketId#3', 'ticketId#4']

            const holdA1 = await fix.ticketHoldingClient.holdTickets({
                showtimeId,
                customerId: customerA,
                ticketIds: firstTickets
            })
            expect(holdA1).toBeTruthy()

            const holdA2 = await fix.ticketHoldingClient.holdTickets({
                showtimeId,
                customerId: customerA,
                ticketIds: newTickets
            })
            expect(holdA2).toBeTruthy()

            const holdB = await fix.ticketHoldingClient.holdTickets({
                showtimeId,
                customerId: customerB,
                ticketIds: firstTickets
            })
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
                                fix.ticketHoldingClient.holdTickets({
                                    showtimeId,
                                    customerId: customer,
                                    ticketIds
                                })
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
        it('선점한 티켓을 반환해야 한다', async () => {
            await fix.ticketHoldingClient.holdTickets({
                showtimeId,
                customerId: customerA,
                ticketIds
            })
            const heldTickets = await fix.ticketHoldingClient.findHeldTicketIds(
                showtimeId,
                customerA
            )
            expect(heldTickets).toEqual(ticketIds)
        })

        it('만료된 티켓은 반환되지 않아야 한다', async () => {
            const { Rules } = await import('shared')
            const holdDuration = 1000
            Rules.Ticket.holdExpirationTime = holdDuration

            await fix.ticketHoldingClient.holdTickets({
                showtimeId,
                customerId: customerA,
                ticketIds
            })

            await sleep(holdDuration + 500)

            const heldTickets = await fix.ticketHoldingClient.findHeldTicketIds(
                showtimeId,
                customerA
            )
            expect(heldTickets).toEqual([])
        })
    })

    describe('releaseTickets', () => {
        it('고객이 선점한 티켓을 해제해야 한다', async () => {
            await fix.ticketHoldingClient.holdTickets({
                showtimeId,
                customerId: customerA,
                ticketIds
            })

            const releaseRes = await fix.ticketHoldingClient.releaseTickets(showtimeId, customerA)
            expect(releaseRes).toBeTruthy()

            const heldTickets = await fix.ticketHoldingClient.findHeldTicketIds(
                showtimeId,
                customerA
            )
            expect(heldTickets).toEqual([])

            const secondResult = await fix.ticketHoldingClient.holdTickets({
                showtimeId,
                customerId: customerB,
                ticketIds
            })
            expect(secondResult).toBeTruthy()
        })
    })
})
