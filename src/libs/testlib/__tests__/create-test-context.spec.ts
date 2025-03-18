import { withTestId } from 'testlib'
import type { Fixture } from './create-test-context.fixture'

describe('createTestContext', () => {
    let fix: Fixture

    beforeEach(async () => {
        const { createFixture } = await import('./create-test-context.fixture')
        fix = await createFixture()
    })

    afterEach(async () => {
        await fix?.teardown()
    })

    it('RPC 메시지를 전송하면 응답해야 한다', async () => {
        await fix.rpcClient.expect(
            withTestId('getRpcMessage'),
            { arg: 'value' },
            { id: 'value' }
        )
    })

    it('Http 메시지를 전송하면 응답해야 한다', async () => {
        await fix.httpClient.get('/message/value').ok({ received: 'value' })
    })
})
