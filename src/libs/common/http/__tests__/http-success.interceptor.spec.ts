import type { Fixture } from './http-success.interceptor.fixture'

describe('HttpSuccessInterceptor', () => {
    let fix: Fixture

    beforeEach(async () => {
        const { createFixture } = await import('./http-success.interceptor.fixture')
        fix = await createFixture()
    })

    afterEach(async () => {
        await fix?.teardown()
    })

    it('Http 요청이 성공하면 Logger.verbose()로 기록해야 한다', async () => {
        await fix.httpClient.get('/').ok()

        expect(fix.spyVerbose).toHaveBeenCalledTimes(1)
        expect(fix.spyVerbose).toHaveBeenCalledWith(
            'Success',
            'HTTP',
            expect.objectContaining({
                statusCode: 200,
                request: { method: 'GET', url: '/' },
                duration: expect.any(String)
            })
        )
    })
})
