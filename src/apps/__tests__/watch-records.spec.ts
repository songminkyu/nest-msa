import { expect } from '@jest/globals'
import { WatchRecordDto } from 'apps/cores'
import { OrderDirection } from 'common'
import { expectEqualUnsorted, testObjectId } from 'testlib'
import { createWatchRecords, Fixture } from './watch-records.fixture'
import { createWatchRecordDto } from './common.fixture'

describe('WatchRecords Module', () => {
    let fix: Fixture

    beforeEach(async () => {
        const { createFixture } = await import('./watch-records.fixture')
        fix = await createFixture()
    })

    afterEach(async () => {
        await fix?.teardown()
    })

    describe('createWatchRecords', () => {
        it('관람 기록을 생성해야 한다', async () => {
            const { createDto, expectedDto } = createWatchRecordDto()

            const watchRecord = await fix.watchRecordsClient.createWatchRecord(createDto)
            expect(watchRecord).toEqual(expectedDto)
        })
    })

    describe('findWatchRecords', () => {
        let records: WatchRecordDto[]
        const customerId = testObjectId('A1')

        beforeEach(async () => {
            records = await createWatchRecords(fix, { customerId })
        })

        it('기본 페이지네이션 설정으로 관람 기록을 가져와야 한다', async () => {
            const { items, ...paginated } = await fix.watchRecordsClient.findWatchRecords({
                customerId,
                take: 100,
                orderby: { name: 'watchDate', direction: OrderDirection.desc }
            })

            expect(paginated).toEqual({
                skip: 0,
                take: 100,
                total: records.length
            })
            expectEqualUnsorted(items, records)
        })
    })
})
