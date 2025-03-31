import { DateUtil } from 'common'
import { WatchRecordsClient, WatchRecordsService } from 'apps/cores'
import { nullObjectId, testObjectId } from 'testlib'
import { AllTestContexts, createAllTestContexts } from './utils'

export interface Fixture {
    testContext: AllTestContexts
    watchRecordsService: WatchRecordsClient
}

export async function createFixture() {
    const testContext = await createAllTestContexts()
    const module = testContext.appsContext.module
    const watchRecordsService = module.get(WatchRecordsClient)

    return { testContext, watchRecordsService }
}

export async function closeFixture(fixture: Fixture) {
    await fixture.testContext.close()
}

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

export const createWatchRecord = async (service: WatchRecordsClient, override = {}) => {
    const { createDto } = createWatchRecordDto(override)

    const watchRecord = await service.createWatchRecord(createDto)
    return watchRecord
}

export const createWatchRecords = async (service: WatchRecordsClient, overrides = {}) => {
    const baseDate = new Date(0)

    return Promise.all(
        Array.from({ length: 10 }, async (_, index) =>
            createWatchRecord(service, {
                movieId: testObjectId(`${index}`),
                watchDate: DateUtil.addDays(baseDate, index),
                ...overrides
            })
        )
    )
}
