import { TicketCreateDto, TicketDto, TicketStatus } from 'apps/cores'
import { omit, uniq } from 'lodash'
import { nullObjectId } from 'testlib'
import { CommonFixture, createCommonFixture } from './utils'

export const buildTicketCreateDto = (overrides = {}) => ({
    batchId: nullObjectId,
    movieId: nullObjectId,
    theaterId: nullObjectId,
    showtimeId: nullObjectId,
    status: TicketStatus.available,
    seat: { block: '1b', row: '1r', seatnum: 1 },
    ...overrides
})

export const buildTicketCreateDtos = (overrides = {}, length: number = 100) => {
    const createDtos: TicketCreateDto[] = []
    const expectedDtos: TicketDto[] = []

    for (let i = 0; i < length; i++) {
        const createDto = buildTicketCreateDto(overrides)

        const expectedDto = { id: expect.any(String), ...omit(createDto, 'batchId') }

        createDtos.push(createDto)
        expectedDtos.push(expectedDto)
    }

    return { createDtos, expectedDtos }
}

export async function createTickets(fix: CommonFixture, createDtos: TicketCreateDto[]) {
    const { success } = await fix.ticketsService.createTickets(createDtos)
    expect(success).toBeTruthy()

    const batchIds = uniq(createDtos.map((dto) => dto.batchId))

    const tickets = await fix.ticketsService.findAllTickets({ batchIds })
    return tickets
}

export class Fixture extends CommonFixture {
    teardown: () => Promise<void>
}

export const createFixture = async () => {
    const commonFixture = await createCommonFixture()

    const teardown = async () => {
        await commonFixture?.close()
    }

    return { ...commonFixture, teardown }
}
