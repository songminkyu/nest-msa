import { CreateShowtimeDto, ShowtimeDto } from 'apps/cores'
import { DateTimeRange } from 'common'
import { buildShowtimeCreateDto } from './common.fixture'
import { CommonFixture, createCommonFixture } from './utils'

export const buildShowtimeCreateDtos = (
    startTimes: Date[],
    overrides: Partial<CreateShowtimeDto> = {}
) => {
    const createDtos: CreateShowtimeDto[] = []
    const expectedDtos: ShowtimeDto[] = []

    startTimes.map((start) => {
        const timeRange = DateTimeRange.create({ start, minutes: 1 })

        const { createDto, expectedDto } = buildShowtimeCreateDto({ ...overrides, timeRange })

        createDtos.push(createDto)
        expectedDtos.push(expectedDto)
    })

    return { createDtos, expectedDtos }
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
