import { DateUtil } from 'common'
import { nullObjectId, testObjectId } from 'testlib'
import { CommonFixture, createCommonFixture } from './utils'

export const createWatchRecordDto = (overrides = {}) => {
    const createDto = {
        customerId: nullObjectId,
        movieId: nullObjectId,
        purchaseId: nullObjectId,
        watchDate: new Date(0),
        ...overrides
    }

    const expectedDto = { id: expect.any(String), ...createDto }

    return { createDto, expectedDto }
}

export const createWatchRecord = async (fix: CommonFixture, override = {}) => {
    const { createDto } = createWatchRecordDto(override)

    const watchRecord = await fix.watchRecordsClient.createWatchRecord(createDto)
    return watchRecord
}

export const createWatchRecords = async (fix: CommonFixture, overrides = {}) => {
    const baseDate = new Date(0)

    return Promise.all(
        Array.from({ length: 10 }, async (_, index) =>
            createWatchRecord(fix, {
                movieId: testObjectId(`${index}`),
                watchDate: DateUtil.addDays(baseDate, index),
                ...overrides
            })
        )
    )
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
