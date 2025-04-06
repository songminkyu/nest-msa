import { expect } from '@jest/globals'
import { CustomerDto } from 'apps/cores'
import { expectEqualUnsorted, nullObjectId } from 'testlib'
import {
    createCustomer,
    biuldCustomerCreateDto,
    createCustomers,
    Fixture
} from './customers.fixture'
import { Errors } from './utils'

/* 고객 통합 테스트 */
describe('Customer Integration Tests', () => {
    let fix: Fixture

    beforeEach(async () => {
        const { createFixture } = await import('./customers.fixture')
        fix = await createFixture()
    })

    afterEach(async () => {
        await fix?.teardown()
    })

    describe('POST /customers', () => {
        it('고객을 생성해야 한다', async () => {
            const { createDto, expectedDto } = biuldCustomerCreateDto()

            await fix.httpClient.post('/customers').body(createDto).created(expectedDto)
        })

        it('이메일이 이미 존재하면 CONFLICT(409)를 반환해야 한다', async () => {
            const { createDto } = biuldCustomerCreateDto()

            await fix.httpClient.post('/customers').body(createDto).created()
            await fix.httpClient
                .post('/customers')
                .body(createDto)
                .conflict({ ...Errors.Customer.emailAlreadyExists, email: createDto.email })
        })

        it('필수 필드가 누락되면 BAD_REQUEST(400)를 반환해야 한다', async () => {
            await fix.httpClient
                .post('/customers')
                .body({})
                .badRequest({ ...Errors.RequestValidation.Failed, details: expect.any(Array) })
        })
    })

    describe('PATCH /customers/:id', () => {
        let customer: CustomerDto

        beforeEach(async () => {
            customer = await createCustomer(fix)
        })

        it('고객 정보를 업데이트해야 한다', async () => {
            const updateDto = {
                name: 'update-name',
                email: 'new@mail.com',
                birthdate: new Date('1900-12-31')
            }
            const expected = { ...customer, ...updateDto }

            await fix.httpClient.patch(`/customers/${customer.id}`).body(updateDto).ok(expected)
            await fix.httpClient.get(`/customers/${customer.id}`).ok(expected)
        })

        it('고객이 존재하지 않으면 NOT_FOUND(404)를 반환해야 한다', async () => {
            await fix.httpClient
                .patch(`/customers/${nullObjectId}`)
                .body({})
                .notFound({ ...Errors.Mongoose.DocumentNotFound, notFoundId: nullObjectId })
        })
    })

    describe('DELETE /customers/:id', () => {
        let customer: CustomerDto

        beforeEach(async () => {
            customer = await createCustomer(fix)
        })

        it('고객을 삭제해야 한다', async () => {
            await fix.httpClient.delete(`/customers/${customer.id}`).ok()
            await fix.httpClient.get(`/customers/${customer.id}`).notFound({
                ...Errors.Mongoose.MultipleDocumentsNotFound,
                notFoundIds: [customer.id]
            })
        })

        it('고객이 존재하지 않으면 NOT_FOUND(404)를 반환해야 한다', async () => {
            await fix.httpClient.delete(`/customers/${nullObjectId}`).notFound({
                ...Errors.Mongoose.MultipleDocumentsNotFound,
                notFoundIds: [nullObjectId]
            })
        })
    })

    describe('GET /customers/:id', () => {
        let customer: CustomerDto

        beforeEach(async () => {
            customer = await createCustomer(fix)
        })

        it('고객 정보를 가져와야 한다', async () => {
            await fix.httpClient.get(`/customers/${customer.id}`).ok(customer)
        })

        it('고객이 존재하지 않으면 NOT_FOUND(404)를 반환해야 한다', async () => {
            await fix.httpClient.get(`/customers/${nullObjectId}`).notFound({
                ...Errors.Mongoose.MultipleDocumentsNotFound,
                notFoundIds: [nullObjectId]
            })
        })
    })

    describe('GET /customers', () => {
        let customers: CustomerDto[]

        beforeEach(async () => {
            customers = await createCustomers(fix)
        })

        it('기본 페이지네이션 설정으로 고객을 가져와야 한다', async () => {
            const { body } = await fix.httpClient.get('/customers').ok()
            const { items, ...paginated } = body

            expect(paginated).toEqual({
                skip: 0,
                take: expect.any(Number),
                total: customers.length
            })
            expectEqualUnsorted(items, customers)
        })

        it('잘못된 필드로 검색하면 BAD_REQUEST(400)를 반환해야 한다', async () => {
            await fix.httpClient
                .get('/customers')
                .query({ wrong: 'value' })
                .badRequest({ ...Errors.RequestValidation.Failed, details: expect.any(Array) })
        })

        it('이름의 일부로 고객을 검색할 수 있어야 한다', async () => {
            const partialName = 'Customer-1'
            const { body } = await fix.httpClient
                .get('/customers')
                .query({ name: partialName })
                .ok()

            const expected = customers.filter((customer) => customer.name.startsWith(partialName))
            expectEqualUnsorted(body.items, expected)
        })

        it('이메일의 일부로 고객을 검색할 수 있어야 한다', async () => {
            const partialEmail = 'user-1'
            const { body } = await fix.httpClient
                .get('/customers')
                .query({ email: partialEmail })
                .ok()

            const expected = customers.filter((customer) => customer.email.startsWith(partialEmail))
            expectEqualUnsorted(body.items, expected)
        })
    })
})
