import { CreateShowtimeDto, ShowtimeDto } from 'apps/cores'
import { DateUtil } from 'common'
import { buildCreateShowtimeDto } from '../common.fixture'
import { CommonFixture, createCommonFixture } from '../__helpers__'

export const buildCreateShowtimeDtos = (
    startTimes: Date[],
    overrides: Partial<CreateShowtimeDto> = {}
) => {
    const createDtos: CreateShowtimeDto[] = []
    const expectedDtos: ShowtimeDto[] = []

    startTimes.map((startTime) => {
        const { createDto, expectedDto } = buildCreateShowtimeDto({
            startTime,
            endTime: DateUtil.addMinutes(startTime, 1),
            ...overrides
        })

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
