import { TicketHoldingClient, TicketHoldingService } from 'apps/cores'
import { generateShortId, sleep } from 'common'
import { closeFixture, Fixture } from './ticket-holding.fixture'

describe('TicketHolding Module', () => {
    let fixture: Fixture
    let client: TicketHoldingClient
    let service: TicketHoldingService

    const customerA = 'customerId#1'
    const customerB = 'customerId#2'
    const showtimeId = 'showtimeId#1'
    const ticketIds = ['ticketId#1', 'ticketId#2']

    beforeEach(async () => {
        const { createFixture } = await import('./ticket-holding.fixture')

        fixture = await createFixture()
        client = fixture.ticketHoldingClient
        service = fixture.ticketHoldingService
    })

    afterEach(async () => {
        await closeFixture(fixture)
    })

    describe('holdTickets', () => {
        it('티켓을 정해진 시간 동안 선점해야 한다', async () => {
            const firstResult = await client.holdTickets({
                showtimeId,
                customerId: customerA,
                ticketIds
            })
            expect(firstResult).toBeTruthy()

            const secondResult = await client.holdTickets({
                showtimeId,
                customerId: customerB,
                ticketIds
            })
            expect(secondResult).toBeFalsy()
        })

        it('고객은 자신이 선점한 티켓을 다시 선점할 수 있다', async () => {
            const firstResult = await client.holdTickets({
                showtimeId,
                customerId: customerA,
                ticketIds
            })
            expect(firstResult).toBeTruthy()

            const secondResult = await client.holdTickets({
                showtimeId,
                customerId: customerA,
                ticketIds
            })
            expect(secondResult).toBeTruthy()
        })

        it('시간이 만료되면 티켓을 다시 선점할 수 있어야 한다', async () => {
            const holdDuration = 1000
            jest.spyOn(service, 'seatHoldExpirationTime', 'get').mockReturnValue(1000)

            const initialResult = await client.holdTickets({
                showtimeId,
                customerId: customerA,
                ticketIds
            })
            expect(initialResult).toBeTruthy()

            await sleep(holdDuration + 500)

            const postExpiryResult = await client.holdTickets({
                showtimeId,
                customerId: customerB,
                ticketIds
            })
            expect(postExpiryResult).toBeTruthy()
        })

        it('동일한 고객이 새로운 티켓을 선점할 때 기존 티켓은 해제되어야 한다', async () => {
            const firstTickets = ['ticketId#1', 'ticketId#2']
            const newTickets = ['ticketId#3', 'ticketId#4']

            const holdA1 = await client.holdTickets({
                showtimeId,
                customerId: customerA,
                ticketIds: firstTickets
            })
            expect(holdA1).toBeTruthy()

            const holdA2 = await client.holdTickets({
                showtimeId,
                customerId: customerA,
                ticketIds: newTickets
            })
            expect(holdA2).toBeTruthy()

            const holdB = await client.holdTickets({
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
                                client.holdTickets({
                                    showtimeId,
                                    customerId: customer,
                                    ticketIds
                                })
                            )
                        )

                        const findResults = await Promise.all(
                            customers.map((customer) =>
                                client.findHeldTicketIds(showtimeId, customer)
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
            await client.holdTickets({ showtimeId, customerId: customerA, ticketIds })
            const heldTickets = await client.findHeldTicketIds(showtimeId, customerA)
            expect(heldTickets).toEqual(ticketIds)
        })

        it('만료된 티켓은 반환되지 않아야 한다', async () => {
            const holdDuration = 1000
            jest.spyOn(service, 'seatHoldExpirationTime', 'get').mockReturnValue(holdDuration)

            await client.holdTickets({ showtimeId, customerId: customerA, ticketIds })

            await sleep(holdDuration + 500)

            const heldTickets = await client.findHeldTicketIds(showtimeId, customerA)
            expect(heldTickets).toEqual([])
        })
    })

    describe('releaseTickets', () => {
        it('고객이 선점한 티켓을 해제해야 한다', async () => {
            await client.holdTickets({ showtimeId, customerId: customerA, ticketIds })

            const releaseRes = await client.releaseTickets(showtimeId, customerA)
            expect(releaseRes).toBeTruthy()

            const heldTickets = await client.findHeldTicketIds(showtimeId, customerA)
            expect(heldTickets).toEqual([])

            const secondResult = await client.holdTickets({
                showtimeId,
                customerId: customerB,
                ticketIds
            })
            expect(secondResult).toBeTruthy()
        })
    })
})
