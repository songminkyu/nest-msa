import type { Fixture } from './client-proxy-with-name.fixture'

describe('ClientProxyService with name', () => {
    let fix: Fixture

    beforeEach(async () => {
        const { createFixture } = await import('./client-proxy-with-name.fixture')
        fix = await createFixture()
    })

    afterEach(async () => {
        await fix?.teardown()
    })

    // ClientProxyService 생성할 때 name을 지정할 수 있어야 한다
    it('Should be able to specify the name when creating the ClientProxyService', async () => {
        await fix.httpClient.get('/value').ok({ result: 'success' })
    })
})
