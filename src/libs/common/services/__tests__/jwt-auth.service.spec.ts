import { sleep } from 'common'
import { Fixture } from './jwt-auth.service.fixture'

describe('JwtAuthService', () => {
    let fix: Fixture

    beforeEach(async () => {
        const { createFixture } = await import('./jwt-auth.service.fixture')
        fix = await createFixture()
    })

    afterEach(async () => {
        await fix?.teardown()
    })

    it('인증 토큰을 생성해야 한다', async () => {
        const tokens = await fix.jwtService.generateAuthTokens('userId', 'email')

        expect(tokens).toEqual({
            accessToken: expect.any(String),
            refreshToken: expect.any(String)
        })
    })

    describe('refreshAuthTokens', () => {
        let accessToken: string
        let refreshToken: string

        beforeEach(async () => {
            const tokens = await fix.jwtService.generateAuthTokens('userId', 'email')
            accessToken = tokens.accessToken
            refreshToken = tokens.refreshToken
        })

        it('유효한 refreshToken을 제공하면 새로운 인증 토큰을 반환해야 한다', async () => {
            const tokens = await fix.jwtService.refreshAuthTokens(refreshToken)

            expect(tokens!.accessToken).not.toEqual(accessToken)
            expect(tokens!.refreshToken).not.toEqual(refreshToken)
        })

        it('잘못된 refreshToken을 제공하면 예외를 던져야 한다', async () => {
            const promise = fix.jwtService.refreshAuthTokens('invalid-token')
            await expect(promise).rejects.toThrow('jwt malformed')
        })

        it('만료된 refreshToken을 제공하면 예외를 던져야 한다', async () => {
            await sleep(3500)

            const promise = fix.jwtService.refreshAuthTokens(refreshToken)
            await expect(promise).rejects.toThrow('jwt expired')
        })

        it('저장된 refreshToken과 다르면 예외를 던져야 한다', async () => {
            jest.spyOn(fix.redis, 'get').mockResolvedValueOnce('unknown token')

            const promise = fix.jwtService.refreshAuthTokens(refreshToken)
            await expect(promise).rejects.toThrow('The provided refresh token is invalid')
        })
    })
})
