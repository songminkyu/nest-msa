import { expect } from '@jest/globals'
import { BadRequestException } from '@nestjs/common'
import { QueryBuilder, newObjectId, objectId, objectIds } from 'common'
import { Types } from 'mongoose'

describe('Mongoose Utils', () => {
    it('newObjectId', async () => {
        const objectId = newObjectId()
        expect(Types.ObjectId.isValid(objectId)).toBeTruthy()
    })

    describe('objectId', () => {
        it('문자열을 ObjectId로 변환해야 한다', () => {
            const idString = '507f1f77bcf86cd799439011'
            const result = objectId(idString)

            expect(result).toBeInstanceOf(Types.ObjectId)
            expect(result.toString()).toBe(idString)
        })

        it('유효하지 않은 ObjectId 문자열에 대해 예외를 던져야 한다', () => {
            const invalidId = 'invalid-id'

            expect(() => objectId(invalidId)).toThrow(
                'input must be a 24 character hex string, 12 byte Uint8Array, or an integer'
            )
        })
    })

    describe('objectIds', () => {
        it('문자열 배열을 ObjectId 배열로 변환해야 한다', () => {
            const idStrings = ['507f1f77bcf86cd799439011', '507f1f77bcf86cd799439012']
            const result = objectIds(idStrings)

            expect(result).toHaveLength(2)
            result.forEach((id, index) => {
                expect(id).toBeInstanceOf(Types.ObjectId)
                expect(id.toString()).toBe(idStrings[index])
            })
        })

        it('빈 배열이 주어지면 빈 배열을 반환해야 한다', () => {
            const result = objectIds([])

            expect(result).toEqual([])
        })

        it('배열에 유효하지 않은 문자열이 있으면 예외를 던져야 한다', () => {
            const idStrings = ['507f1f77bcf86cd799439011', 'invalid-id']

            expect(() => objectIds(idStrings)).toThrow(
                'input must be a 24 character hex string, 12 byte Uint8Array, or an integer'
            )
        })
    })

    describe('QueryBuilder', () => {
        interface TestModel {
            _id: Types.ObjectId
            name: string
            createdAt: Date
        }

        let builder: QueryBuilder<TestModel>

        beforeEach(() => {
            builder = new QueryBuilder<TestModel>()
        })

        describe('addEqual', () => {
            it('유효한 값이 주어지면 쿼리에 추가해야 한다', () => {
                builder.addEqual('name', 'test')
                expect(builder.build({})).toEqual({ name: 'test' })
            })

            it('undefined나 null이면 쿼리에 추가하지 않아야 한다', () => {
                builder.addEqual('name', undefined)
                builder.addEqual('name', null)
                expect(builder.build({ allowEmpty: true })).toEqual({})
            })
        })

        describe('addId', () => {
            it('유효한 ID가 주어지면 ObjectId로 변환되어 쿼리에 추가해야 한다', () => {
                const id = new Types.ObjectId().toString()
                builder.addId('_id', id)
                expect(builder.build({})).toEqual({ _id: objectId(id) })
            })

            it('undefined이면 쿼리에 추가하지 않아야 한다', () => {
                builder.addId('_id', undefined)
                expect(builder.build({ allowEmpty: true })).toEqual({})
            })
        })

        describe('addIn', () => {
            it('유효한 ID 배열이 주어지면 $in 조건을 쿼리에 추가해야 한다', () => {
                const ids = [new Types.ObjectId().toString(), new Types.ObjectId().toString()]
                builder.addIn('_id', ids)
                expect(builder.build({})).toEqual({ _id: { $in: objectIds(ids) } })
            })

            it('중복된 ID가 있으면 중복을 제거해야 한다', () => {
                const id = new Types.ObjectId().toString()
                const ids = [id, new Types.ObjectId().toString(), id]

                builder.addIn('_id', ids)
                expect(builder.build({})).toEqual({ _id: { $in: objectIds([id, ids[1]]) } })
            })

            it('빈 배열이나 undefined이면 쿼리에 추가하지 않아야 한다', () => {
                builder.addIn('_id', [])
                builder.addIn('_id', undefined)
                expect(builder.build({ allowEmpty: true })).toEqual({})
            })
        })

        describe('addRegex', () => {
            it('유효한 문자열이 주어지면 정규 표현식을 쿼리에 추가해야 한다', () => {
                builder.addRegex('name', 'test')
                expect(builder.build({})).toEqual({ name: new RegExp('test', 'i') })
            })

            it('undefined이면 쿼리에 추가하지 않아야 한다', () => {
                builder.addRegex('name', undefined)
                expect(builder.build({ allowEmpty: true })).toEqual({})
            })
        })

        describe('addRange', () => {
            it('start와 end가 주어지면 $gte와 $lte를 쿼리에 추가해야 한다', () => {
                const range = { start: new Date('2023-01-01'), end: new Date('2023-12-31') }
                builder.addRange('createdAt', range)
                expect(builder.build({})).toEqual({
                    createdAt: { $gte: range.start, $lte: range.end }
                })
            })

            it('start만 주어지면 $gte를 쿼리에 추가해야 한다', () => {
                const range = { start: new Date('2023-01-01') }
                builder.addRange('createdAt', range)
                expect(builder.build({})).toEqual({ createdAt: { $gte: range.start } })
            })

            it('end만 주어지면 $lte를 쿼리에 추가해야 한다', () => {
                const range = { end: new Date('2023-12-31') }
                builder.addRange('createdAt', range)
                expect(builder.build({})).toEqual({ createdAt: { $lte: range.end } })
            })

            it('undefined이면 쿼리에 추가하지 않아야 한다', () => {
                builder.addRange('createdAt', undefined)
                expect(builder.build({ allowEmpty: true })).toEqual({})
            })
        })

        describe('build', () => {
            it('추가된 조건이 있으면 쿼리 객체를 반환해야 한다', () => {
                builder.addEqual('name', 'test')
                expect(builder.build({})).toEqual({ name: 'test' })
            })

            it('조건이 없으면 BadRequestException을 던져야 한다', () => {
                expect(() => builder.build({})).toThrow(BadRequestException)
            })

            it('allowEmpty가 true면 빈 쿼리를 허용한다', () => {
                expect(builder.build({ allowEmpty: true })).toEqual({})
            })
        })
    })
})
