import { TicketStatus } from 'apps/cores'
import { pickIds } from 'common'
import { expectEqualUnsorted, testObjectId } from 'testlib'
import { buildTicketCreateDtos, createTickets, Fixture } from './tickets.fixture'

describe('Tickets Module', () => {
    let fix: Fixture

    beforeEach(async () => {
        const { createFixture } = await import('./tickets.fixture')
        fix = await createFixture()
    })

    afterEach(async () => {
        await fix?.teardown()
    })

    it('createTickets', async () => {
        const { createDtos, expectedDtos } = buildTicketCreateDtos()

        const tickets = await createTickets(fix, createDtos)
        expectEqualUnsorted(tickets, expectedDtos)
    })

    describe('findAllTickets', () => {
        beforeEach(async () => {
            const { createDtos } = buildTicketCreateDtos()
            await createTickets(fix, createDtos)
        })

        const createAndFindTickets = async (overrides = {}, findFilter = {}) => {
            const { createDtos, expectedDtos } = buildTicketCreateDtos(overrides)
            await fix.ticketsClient.createTickets(createDtos)

            const tickets = await fix.ticketsClient.findAllTickets(findFilter)
            expectEqualUnsorted(tickets, expectedDtos)
        }

        it('batchIds', async () => {
            const batchId = testObjectId(0xa1)
            await createAndFindTickets({ batchId }, { batchIds: [batchId] })
        })

        it('movieIds', async () => {
            const movieId = testObjectId(0xa1)
            await createAndFindTickets({ movieId }, { movieIds: [movieId] })
        })

        it('theaterIds', async () => {
            const theaterId = testObjectId(0xa1)
            await createAndFindTickets({ theaterId }, { theaterIds: [theaterId] })
        })

        it('showtimeIds', async () => {
            const showtimeId = testObjectId(0xa1)
            await createAndFindTickets({ showtimeId }, { showtimeIds: [showtimeId] })
        })

        it('1개 이상의 필터를 설정하지 않으면 BAD_REQUEST(400)를 반환해야 한다', async () => {
            const promise = createAndFindTickets({})
            await expect(promise).rejects.toThrow('At least one filter condition must be provided')
        })
    })

    it('updateTicketStatus', async () => {
        const { createDtos } = buildTicketCreateDtos({})
        const tickets = await createTickets(fix, createDtos)
        const ticket = tickets[0]
        expect(ticket.status).toEqual(TicketStatus.available)

        const updatedTickets = await fix.ticketsClient.updateTicketStatus(
            [ticket.id],
            TicketStatus.sold
        )
        const updatedStatuses = updatedTickets.map((ticket) => ticket.status)
        expect(updatedStatuses).toEqual([TicketStatus.sold])
    })

    it('getSalesStatuses', async () => {
        const showtimeId = testObjectId(0xa1)
        const ticketCount = 50
        const soldCount = 5

        const { createDtos } = buildTicketCreateDtos({ showtimeId }, ticketCount)
        const tickets = await createTickets(fix, createDtos)
        const ticketIds = pickIds(tickets.slice(0, soldCount))
        await fix.ticketsClient.updateTicketStatus(ticketIds, TicketStatus.sold)
        const salesStatuses = await fix.ticketsClient.getSalesStatuses([showtimeId])

        expect(salesStatuses).toEqual([
            { showtimeId, total: ticketCount, sold: soldCount, available: ticketCount - soldCount }
        ])
    })
})
