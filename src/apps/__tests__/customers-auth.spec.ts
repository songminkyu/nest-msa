import { getModelToken } from '@nestjs/mongoose'
import { Customer, CustomerDto } from 'apps/cores'
import { Fixture } from './customers-auth.fixture'
import { createCustomer } from './customers.fixture'
import { Errors } from './utils'

/* 고객 인증 테스트 */
describe('Customer Authentication Tests', () => {
    let fix: Fixture
    let customer: CustomerDto
    const email = 'user@mail.com'
    const password = 'password'

    beforeEach(async () => {
        const { createFixture } = await import('./customers-auth.fixture')
        fix = await createFixture()

        customer = await createCustomer(fix, { email, password })
    })

    afterEach(async () => {
        await fix?.teardown()
    })

    describe('POST /login', () => {
        it('로그인에 성공하면 인증 토큰을 반환해야 한다', async () => {
            await fix.httpClient
                .post('/customers/login')
                .body({ email, password })
                .ok({
                    accessToken: expect.any(String),
                    refreshToken: expect.any(String)
                })
        })

        it('비밀번호가 틀리면 UNAUTHORIZED(401)를 반환해야 한다', async () => {
            await fix.httpClient
                .post('/customers/login')
                .body({ email, password: 'wrong password' })
                .unauthorized(Errors.Auth.Unauthorized)
        })

        it('이메일이 존재하지 않으면 UNAUTHORIZED(401)를 반환해야 한다', async () => {
            await fix.httpClient
                .post('/customers/login')
                .body({ email: 'unknown@mail.com', password: '.' })
                .unauthorized(Errors.Auth.Unauthorized)
        })

        it('customer가 존재하지 않으면 UNAUTHORIZED(401)를 반환해야 한다', async () => {
            /*
            CustomersRepository의 아래 코드를 모의하는 것이다. 코드 커버리지를 위해 작성한 테스트다.

            this.model.findById(customerId).select('+password').exec()
            */
            const model = fix.coresContext.module.get(getModelToken(Customer.name))

            jest.spyOn(model, 'findById').mockReturnValue({
                select: jest.fn().mockReturnValue({
                    exec: jest.fn().mockResolvedValue(null)
                })
            })

            await fix.httpClient
                .post('/customers/login')
                .body({ email, password })
                .unauthorized(Errors.Auth.Unauthorized)
        })
    })

    describe('POST /refresh', () => {
        let accessToken: string
        let refreshToken: string

        beforeEach(async () => {
            const { body } = await fix.httpClient
                .post('/customers/login')
                .body({ email, password })
                .ok()

            accessToken = body.accessToken
            refreshToken = body.refreshToken
        })

        it('유효한 refreshToken을 제공하면 새로운 인증 토큰을 반환해야 한다', async () => {
            const { body } = await fix.httpClient
                .post('/customers/refresh')
                .body({ refreshToken })
                .ok()

            expect(body.accessToken).not.toEqual(accessToken)
            expect(body.refreshToken).not.toEqual(refreshToken)
        })

        it('잘못된 refreshToken을 제공하면 UNAUTHORIZED(401)를 반환해야 한다', async () => {
            await fix.httpClient
                .post('/customers/refresh')
                .body({ refreshToken: 'invalid-token' })
                .unauthorized({
                    ...Errors.JwtAuth.RefreshTokenVerificationFailed,
                    message: 'jwt malformed'
                })
        })
    })

    describe('accessToken 검증', () => {
        let accessToken: string

        beforeEach(async () => {
            const { body } = await fix.httpClient
                .post('/customers/login')
                .body({ email, password })
                .ok()

            accessToken = body.accessToken
        })

        it('유효한 accessToken을 제공하면 접근이 허용되어야 한다', async () => {
            await fix.httpClient
                .get(`/customers/${customer.id}`)
                .headers({ Authorization: `Bearer ${accessToken}` })
                .ok()
        })

        it('잘못된 accessToken을 제공하면 UNAUTHORIZED(401)를 반환해야 한다', async () => {
            await fix.httpClient
                .get(`/customers/${customer.id}`)
                .headers({ Authorization: 'Bearer Invalid-Token' })
                .unauthorized(Errors.Auth.Unauthorized)
        })
    })
})
