import { expect } from '@jest/globals'
import { WatchRecordDto } from 'apps/cores'
import { expectEqualUnsorted, testObjectId } from 'testlib'
import { buildWatchRecordCreateDto, createWatchRecord } from './common.fixture'
import { Fixture } from './watch-records.fixture'

describe('WatchRecords', () => {
    let fix: Fixture

    beforeEach(async () => {
        const { createFixture } = await import('./watch-records.fixture')
        fix = await createFixture()
    })

    afterEach(async () => {
        await fix?.teardown()
    })

    describe('createWatchRecord', () => {
        /* 관람 기록을 생성해야 한다 */
        it('Should create a watch record', async () => {
            const { createDto, expectedDto } = buildWatchRecordCreateDto()

            const watchRecord = await fix.watchRecordsClient.createWatchRecord(createDto)
            expect(watchRecord).toEqual(expectedDto)
        })
    })

    describe('searchWatchRecordsPage', () => {
        let records: WatchRecordDto[]
        const customerId = testObjectId(0xa1)

        beforeEach(async () => {
            records = await Promise.all([
                createWatchRecord(fix, { customerId }),
                createWatchRecord(fix, { customerId }),
                createWatchRecord(fix, { customerId }),
                createWatchRecord(fix, { customerId })
            ])
        })

        /* 기본 페이지네이션 설정으로 관람 기록을 가져와야 한다 */
        it('Should fetch watch records with default pagination settings', async () => {
            const { items, ...paginated } = await fix.watchRecordsClient.searchWatchRecordsPage({
                customerId,
                take: 100
            })

            expect(paginated).toEqual({ skip: 0, take: 100, total: records.length })
            expectEqualUnsorted(items, records)
        })
    })
})
