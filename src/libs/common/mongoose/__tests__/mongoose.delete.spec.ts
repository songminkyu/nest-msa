import { expect } from '@jest/globals'
import { Fixture, HardDeleteSample, SoftDeleteSample } from './mongoose.delete.fixture'

describe('Mongoose Delete', () => {
    describe('Soft Delete', () => {
        let fix: Fixture<SoftDeleteSample>

        beforeEach(async () => {
            const { createFixture } = await import('./mongoose.delete.fixture')
            fix = await createFixture(SoftDeleteSample)
        })

        afterEach(async () => {
            await fix?.teardown()
        })

        it('deletedAt의 초기값은 null이다', async () => {
            expect(fix.doc).toMatchObject({ deletedAt: null })
        })

        it('deleteOne으로 삭제하면 삭제된 시간이 deletedAt에 기록되어야 한다', async () => {
            await fix.model.deleteOne({ _id: fix.doc._id })

            const found = await fix.model
                .findOne({ _id: { $eq: fix.doc._id } })
                .setOptions({ withDeleted: true })
                .exec()

            expect(found?.deletedAt).toEqual(expect.any(Date))
        })

        it('deleteMany로 삭제하면 삭제된 시간이 deletedAt에 기록되어야 한다', async () => {
            const doc2 = new fix.model()
            doc2.name = 'name'
            await doc2.save()

            await fix.model.deleteMany({ _id: { $in: [fix.doc._id, doc2._id] } as any })

            const found = await fix.model.find({}).setOptions({ withDeleted: true })
            expect(found[0]).toMatchObject({ deletedAt: expect.any(Date) })
            expect(found[1]).toMatchObject({ deletedAt: expect.any(Date) })
        })

        it('삭제된 문서는 aggregate에서 검색되지 않아야 한다', async () => {
            await fix.model.deleteOne({ _id: fix.doc._id })

            const got = await fix.model.aggregate([{ $match: { name: 'name' } }])

            expect(got).toHaveLength(0)
        })
    })

    describe('Hard Delete', () => {
        let fix: Fixture<HardDeleteSample>

        beforeEach(async () => {
            const { createFixture } = await import('./mongoose.delete.fixture')
            fix = await createFixture(HardDeleteSample)
        })

        afterEach(async () => {
            await fix?.teardown()
        })

        it('데이터를 완전히 삭제해야 한다', async () => {
            expect(fix.doc).not.toHaveProperty('deletedAt')
        })
    })
})
