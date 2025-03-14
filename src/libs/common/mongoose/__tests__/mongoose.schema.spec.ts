import { expect } from '@jest/globals'
import { Types } from 'mongoose'
import type { Fixture } from './mongoose.schema.fixture'

describe('Mongoose Schema Examples', () => {
    let fix: Fixture

    beforeEach(async () => {
        const { createFixture } = await import('./mongoose.schema.fixture')
        fix = await createFixture()
    })

    afterEach(async () => {
        await fix?.teardown()
    })

    it('Mongoose의 모든 기본 데이터 타입 저장 및 조회 검증', async () => {
        const doc = new fix.model()
        doc.sn = 1234567
        doc.name = 'Statue of Liberty'
        doc.binary = Buffer.alloc(0)
        doc.living = false
        doc.updated = new Date()
        doc.age = 65
        doc.mixed = { any: { thing: 'i want' } }
        doc.someId = new Types.ObjectId()
        doc.decimal = '123.45' as unknown as Types.Decimal128
        doc.array = [1, 'two', { three: 3 }]
        doc.ofString = ['strings!', 'more strings']
        doc.ofNumber = [1, 2, 3, 4]
        doc.ofDates = [new Date(), new Date(Date.now() - 100000)]
        doc.ofBuffer = [Buffer.from('hello'), Buffer.from('world')]
        doc.ofMixed = [1, 'two', { three: 3 }]
        doc.nested = { stuff: '  Hello World  ' }
        doc.map = new Map<string, any>([
            ['key1', 'value1'],
            ['key2', 2]
        ])
        await doc.save()

        const found = await fix.model.findOne({ _id: doc._id }).exec()
        expect(found?.toJSON()).toEqual(doc.toJSON())
    })
})
