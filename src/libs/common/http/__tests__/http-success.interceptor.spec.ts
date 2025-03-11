import {  HttpTestClient } from 'testlib'

describe('HttpSuccessInterceptor', () => {
    let teardown = () => {}
    let client: HttpTestClient
    let spy: jest.SpyInstance

    beforeEach(async () => {
        const { createFixture } = await import('./http-success.interceptor.fixture')

        const fixture = await createFixture()
        teardown = fixture.teardown
        spy = fixture.spy
        client = fixture.client
    })

    afterEach(async () => {
        await teardown()
    })

    it('Http 요청이 성공하면 Logger.verbose()로 기록해야 한다', async () => {
        await client.get('/').ok()

        expect(spy).toHaveBeenCalledTimes(1)
        expect(spy).toHaveBeenCalledWith(
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
