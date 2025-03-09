import { HttpTestClient, RpcTestClient, withTestId } from 'testlib'

describe('createTestContext', () => {
    let closeFixture: () => void
    let microClient: RpcTestClient
    let httpClient: HttpTestClient

    beforeEach(async () => {
        const { createFixture } = await import('./create-test-context.fixture')
        const fixture = await createFixture()

        closeFixture = fixture.closeFixture
        microClient = fixture.rpcClient
        httpClient = fixture.httpClient
    })

    afterEach(async () => {
        await closeFixture?.()
    })

    it('Microservice 메시지를 전송하면 응답해야 한다', async () => {
        await microClient.expect(
            withTestId('subject.getMicroserviceMessage'),
            { arg: 'value' },
            { id: 'value' }
        )
    })

    it('Http 메시지를 전송하면 응답해야 한다', async () => {
        await httpClient.get('/message/value').ok({ received: 'value' })
    })
})
