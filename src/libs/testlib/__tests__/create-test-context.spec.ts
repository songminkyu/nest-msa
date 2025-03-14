import { withTestId } from 'testlib'
import type { Fixture } from './create-test-context.fixture'
// TODO Fixture 타입 정보를 사용하고 싶다면 타입 전용 import를 활용하면 됩니다. 타입 전용 import는 런타임 코드에 영향을 주지 않고, 컴파일 타임에만 타입 체크를 위한 용도로 사용됩니다.

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
            withTestId('subject.getRpcMessage'),
            { arg: 'value' },
            { id: 'value' }
        )
    })

    it('Http 메시지를 전송하면 응답해야 한다', async () => {
        await fix.httpClient.get('/message/value').ok({ received: 'value' })
    })
})
