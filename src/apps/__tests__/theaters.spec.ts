import { expect } from '@jest/globals'
import { TheaterDto } from 'apps/cores'
import { expectEqualUnsorted, nullObjectId } from 'testlib'
import { buildTheaterCreateDto, createTheater } from './common.fixture'
import { Fixture } from './theaters.fixture'
import { Errors } from './utils'

describe('Theaters', () => {
    let fix: Fixture

    beforeEach(async () => {
        const { createFixture } = await import('./theaters.fixture')
        fix = await createFixture()
    })

    afterEach(async () => {
        await fix?.teardown()
    })

    describe('POST /theaters', () => {
        it('극장을 생성해야 한다', async () => {
            const { createDto, expectedDto } = buildTheaterCreateDto()

            await fix.httpClient.post('/theaters').body(createDto).created(expectedDto)
        })

        it('필수 필드가 누락되면 BAD_REQUEST(400)를 반환해야 한다', async () => {
            await fix.httpClient
                .post('/theaters')
                .body({})
                .badRequest({ ...Errors.RequestValidation.Failed, details: expect.any(Array) })
        })
    })

    describe('PATCH /theaters/:id', () => {
        let theater: TheaterDto

        beforeEach(async () => {
            theater = await createTheater(fix)
        })

        it('극장 정보를 업데이트해야 한다', async () => {
            const updateDto = {
                name: 'update-name',
                latlong: { latitude: 30.0, longitude: 120.0 },
                seatmap: []
            }
            const expected = { ...theater, ...updateDto }

            await fix.httpClient.patch(`/theaters/${theater.id}`).body(updateDto).ok(expected)
            await fix.httpClient.get(`/theaters/${theater.id}`).ok(expected)
        })

        it('극장이 존재하지 않으면 NOT_FOUND(404)를 반환해야 한다', async () => {
            await fix.httpClient
                .patch(`/theaters/${nullObjectId}`)
                .body({})
                .notFound({ ...Errors.Mongoose.DocumentNotFound, notFoundId: nullObjectId })
        })
    })

    describe('DELETE /theaters/:id', () => {
        let theater: TheaterDto

        beforeEach(async () => {
            theater = await createTheater(fix)
        })

        it('극장을 삭제해야 한다', async () => {
            await fix.httpClient.delete(`/theaters/${theater.id}`).ok()
            await fix.httpClient.get(`/theaters/${theater.id}`).notFound({
                ...Errors.Mongoose.MultipleDocumentsNotFound,
                notFoundIds: [theater.id]
            })
        })

        it('극장이 존재하지 않으면 NOT_FOUND(404)를 반환해야 한다', async () => {
            await fix.httpClient.delete(`/theaters/${nullObjectId}`).notFound({
                ...Errors.Mongoose.MultipleDocumentsNotFound,
                notFoundIds: [nullObjectId]
            })
        })
    })

    describe('GET /theaters/:id', () => {
        let theater: TheaterDto

        beforeEach(async () => {
            theater = await createTheater(fix)
        })

        it('극장 정보를 가져와야 한다', async () => {
            await fix.httpClient.get(`/theaters/${theater.id}`).ok(theater)
        })

        it('극장이 존재하지 않으면 NOT_FOUND(404)를 반환해야 한다', async () => {
            await fix.httpClient.get(`/theaters/${nullObjectId}`).notFound({
                ...Errors.Mongoose.MultipleDocumentsNotFound,
                notFoundIds: [nullObjectId]
            })
        })
    })

    describe('GET /theaters', () => {
        let theaters: TheaterDto[]

        beforeEach(async () => {
            theaters = await Promise.all([
                createTheater(fix, { name: 'Theater-a1' }),
                createTheater(fix, { name: 'Theater-a2' }),
                createTheater(fix, { name: 'Theater-b1' }),
                createTheater(fix, { name: 'Theater-b2' }),
                createTheater(fix, { name: 'Theater-c1' })
            ])
        })

        it('기본 페이지네이션 설정으로 극장을 가져와야 한다', async () => {
            const { body } = await fix.httpClient.get('/theaters').ok()
            const { items, ...paginated } = body

            expect(paginated).toEqual({ skip: 0, take: expect.any(Number), total: theaters.length })
            expectEqualUnsorted(items, theaters)
        })

        it('잘못된 필드로 검색하면 BAD_REQUEST(400)를 반환해야 한다', async () => {
            await fix.httpClient
                .get('/theaters')
                .query({ wrong: 'value' })
                .badRequest({ ...Errors.RequestValidation.Failed, details: expect.any(Array) })
        })

        it('이름의 일부로 극장을 검색할 수 있어야 한다', async () => {
            const partialName = 'Theater-a'
            const { body } = await fix.httpClient.get('/theaters').query({ name: partialName }).ok()

            expectEqualUnsorted(body.items, [theaters[0], theaters[1]])
        })
    })
})
