import { DateUtil } from 'common'
import { testObjectId } from 'testlib'
import { CommonFixture, createCommonFixture } from './utils'
import { createWatchRecord } from './common.fixture'

export const createWatchRecords = async (fix: CommonFixture, overrides = {}) => {
    const baseDate = new Date(1)

    return Promise.all(
        Array.from({ length: 10 }, async (_, index) =>
            createWatchRecord(fix, {
                movieId: testObjectId(index),
                watchDate: DateUtil.addDays(baseDate, index),
                ...overrides
            })
        )
    )
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
