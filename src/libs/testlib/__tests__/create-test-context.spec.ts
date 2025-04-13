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

    /* RPC 메시지를 전송하면 응답해야 한다 */
    it('Should respond when an RPC message is sent', async () => {
        await fix.rpcClient.expect(withTestId('getRpcMessage'), { arg: 'value' }, { id: 'value' })
    })

    /* Http 메시지를 전송하면 응답해야 한다 */
    it('Should respond when an HTTP message is sent', async () => {
        await fix.httpClient.get('/message/value').ok({ received: 'value' })
    })
})
