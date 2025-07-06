import { sleep } from 'common'
import type { Fixture } from './jwt-auth.service.fixture'

describe('JwtAuthService', () => {
    let fix: Fixture

    beforeEach(async () => {
        const { createFixture } = await import('./jwt-auth.service.fixture')
        fix = await createFixture()
    })

    afterEach(async () => {
        await fix?.teardown()
    })

    // 인증 토큰을 생성해야 한다
    it('Should create an authentication token', async () => {
        const payload = { userId: 'userId', email: 'email' }
        const tokens = await fix.jwtService.generateAuthTokens(payload)

        expect(tokens).toEqual({
            accessToken: expect.any(String),
            refreshToken: expect.any(String)
        })
    })

    describe('refreshAuthTokens', () => {
        let accessToken: string
        let refreshToken: string

        beforeEach(async () => {
            const payload = { userId: 'userId', email: 'email' }
            const tokens = await fix.jwtService.generateAuthTokens(payload)
            accessToken = tokens.accessToken
            refreshToken = tokens.refreshToken
        })

        // 유효한 refreshToken을 제공하면 새로운 인증 토큰을 반환해야 한다
        it('Should return new auth tokens if a valid refreshToken is provided', async () => {
            const tokens = await fix.jwtService.refreshAuthTokens(refreshToken)

            expect(tokens!.accessToken).not.toEqual(accessToken)
            expect(tokens!.refreshToken).not.toEqual(refreshToken)
        })

        // 잘못된 refreshToken을 제공하면 예외를 던져야 한다
        it('Should throw an exception if an invalid refreshToken is provided', async () => {
            const promise = fix.jwtService.refreshAuthTokens('invalid-token')
            await expect(promise).rejects.toThrow('jwt malformed')
        })

        // 만료된 refreshToken을 제공하면 예외를 던져야 한다
        it('Should throw an exception if the refreshToken is expired', async () => {
            await sleep(3500)

            const promise = fix.jwtService.refreshAuthTokens(refreshToken)
            await expect(promise).rejects.toThrow('jwt expired')
        })

        // 저장된 refreshToken과 다르면 예외를 던져야 한다
        it('Should throw an exception if the stored refreshToken is different', async () => {
            jest.spyOn(fix.redis, 'get').mockResolvedValueOnce('unknown token')

            const promise = fix.jwtService.refreshAuthTokens(refreshToken)
            await expect(promise).rejects.toThrow('The provided refresh token is invalid')
        })
    })
})
