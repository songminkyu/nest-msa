import { TicketDto, TicketStatus } from 'apps/cores'
import { pickIds } from 'common'
import { expectEqualUnsorted, testObjectId } from 'testlib'
import { buildTicketCreateDto, createTickets } from './common.fixture'
import { buildTicketCreateDtos, Fixture } from './tickets.fixture'

describe('Tickets', () => {
    let fix: Fixture

    beforeEach(async () => {
        const { createFixture } = await import('./tickets.fixture')
        fix = await createFixture()
    })

    afterEach(async () => {
        await fix?.teardown()
    })

    it('createTickets', async () => {
        const { createDto, expectedDto } = buildTicketCreateDto()

        const tickets = await createTickets(fix, [createDto])
        expectEqualUnsorted(tickets, [expectedDto])
    })

    describe('findAllTickets', () => {
        const batchIds = [testObjectId(0x10), testObjectId(0x11)]
        const movieIds = [testObjectId(0x20), testObjectId(0x21)]
        const theaterIds = [testObjectId(0x30), testObjectId(0x31)]
        const showtimeIds = [testObjectId(0x40), testObjectId(0x41)]
        let expectedDtos: TicketDto[]

        beforeEach(async () => {
            const allDtos = [
                buildTicketCreateDto({ batchId: batchIds[0] }),
                buildTicketCreateDto({ batchId: batchIds[1] }),
                buildTicketCreateDto({ movieId: movieIds[0] }),
                buildTicketCreateDto({ movieId: movieIds[1] }),
                buildTicketCreateDto({ theaterId: theaterIds[0] }),
                buildTicketCreateDto({ theaterId: theaterIds[1] }),
                buildTicketCreateDto({ showtimeId: showtimeIds[0] }),
                buildTicketCreateDto({ showtimeId: showtimeIds[1] })
            ]
            const createDtos = allDtos.map((dto) => dto.createDto)
            expectedDtos = allDtos.map((dto) => dto.expectedDto)

            const { success } = await fix.ticketsService.createTickets(createDtos)
            expect(success).toBeTruthy()
        })

        it('batchIds', async () => {
            const tickets = await fix.ticketsClient.findAllTickets({ batchIds })
            expectEqualUnsorted(tickets, [expectedDtos[0], expectedDtos[1]])
        })

        it('movieIds', async () => {
            const tickets = await fix.ticketsClient.findAllTickets({ movieIds })
            expectEqualUnsorted(tickets, [expectedDtos[2], expectedDtos[3]])
        })

        it('theaterIds', async () => {
            const tickets = await fix.ticketsClient.findAllTickets({ theaterIds })
            expectEqualUnsorted(tickets, [expectedDtos[4], expectedDtos[5]])
        })

        it('showtimeIds', async () => {
            const tickets = await fix.ticketsClient.findAllTickets({ showtimeIds })
            expectEqualUnsorted(tickets, [expectedDtos[6], expectedDtos[7]])
        })

        it('1개 이상의 필터를 설정하지 않으면 BAD_REQUEST(400)를 반환해야 한다', async () => {
            const promise = fix.ticketsClient.findAllTickets({})
            await expect(promise).rejects.toThrow('At least one filter condition must be provided')
        })
    })

    describe('updateTicketStatus', () => {
        const batchId = testObjectId(0x01)
        let tickets: TicketDto[]

        const getStatus = async () => {
            const tickets = await fix.ticketsClient.findAllTickets({ batchIds: [batchId] })
            return tickets.map((ticket) => ticket.status)
        }

        beforeEach(async () => {
            const createDtos = [
                buildTicketCreateDto({ batchId }).createDto,
                buildTicketCreateDto({ batchId }).createDto
            ]
            const { success } = await fix.ticketsClient.createTickets(createDtos)
            expect(success).toBeTruthy()

            tickets = await fix.ticketsClient.findAllTickets({ batchIds: [batchId] })
        })

        it('티켓의 상태를 변경해야 한다', async () => {
            expect(await getStatus()).toEqual([TicketStatus.available, TicketStatus.available])

            const updatedTickets = await fix.ticketsClient.updateTicketStatus(
                pickIds(tickets),
                TicketStatus.sold
            )
            expect(updatedTickets.map((ticket) => ticket.status)).toEqual([
                TicketStatus.sold,
                TicketStatus.sold
            ])

            expect(await getStatus()).toEqual([TicketStatus.sold, TicketStatus.sold])
        })
    })

    it('getSalesStatuses', async () => {
        const showtimeId = testObjectId(0x10)
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
