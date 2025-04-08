import { ShowtimeCreateDto, ShowtimeDto } from 'apps/cores'
import { omit, uniq } from 'lodash'
import { nullObjectId } from 'testlib'
import { CommonFixture, createCommonFixture } from './utils'
import { DateTimeRange } from 'common'

export const buildShowtimeCreateDto = (overrides: Partial<ShowtimeCreateDto> = {}) => ({
    batchId: nullObjectId,
    movieId: nullObjectId,
    theaterId: nullObjectId,
    timeRange: DateTimeRange.create({ start: new Date('2000-01-01T12:00'), minutes: 90 }),
    ...overrides
})

export const buildShowtimeCreateDtos = (overrides = {}, length: number = 100) => {
    const createDtos: ShowtimeCreateDto[] = []
    const expectedDtos: ShowtimeDto[] = []

    for (let i = 0; i < length; i++) {
        const createDto = buildShowtimeCreateDto({
            timeRange: DateTimeRange.create({ start: new Date(2000, 0, 1, i, 0), minutes: 90 }),
            ...overrides
        })

        const expectedDto = { id: expect.any(String), ...omit(createDto, 'batchId') }

        createDtos.push(createDto)
        expectedDtos.push(expectedDto)
    }

    return { createDtos, expectedDtos }
}

export async function createShowtimes(fix: CommonFixture, createDtos: ShowtimeCreateDto[]) {
    const { success } = await fix.showtimesClient.createShowtimes(createDtos)
    expect(success).toBeTruthy()

    const batchIds = uniq(createDtos.map((dto) => dto.batchId))

    const showtimes = await fix.showtimesClient.findAllShowtimes({ batchIds })
    return showtimes
}

export interface Fixture extends CommonFixture {
    teardown: () => Promise<void>
}

export const createFixture = async () => {
    const commonFixture = await createCommonFixture()

    const teardown = async () => {
        await commonFixture?.close()
    }

    return { ...commonFixture, teardown }
}
