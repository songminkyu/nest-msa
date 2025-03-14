import { withTestId } from 'testlib'
import type { Fixture } from './rpc-exception.filter.fixture'

describe('RpcExceptionFilter', () => {
    let fix: Fixture

    beforeEach(async () => {
        const { createFixture } = await import('./rpc-exception.filter.fixture')
        fix = await createFixture()
    })

    afterEach(async () => {
        await fix?.teardown()
    })

    it('RpcController에서 던지는 HttpException이 복원되어야 한다', async () => {
        await fix.rpcClient.error(
            withTestId('subject.throwHttpException'),
            {},
            {
                status: 404,
                response: { error: 'Not Found', message: 'not found exception' }
            }
        )
    })

    it('RpcController에서 던지는 Error가 복원되어야 한다', async () => {
        await fix.rpcClient.error(
            withTestId('subject.throwError'),
            {},
            {
                status: 500,
                response: { error: 'Internal server error', message: 'error message' }
            }
        )
    })

    it('잘못된 데이터 형식에 대해 입력을 검증하고 오류를 반환해야 한다', async () => {
        await fix.rpcClient.error(
            withTestId('subject.verifyDto'),
            { wrong: 'wrong field' },
            {
                status: 400,
                response: {
                    error: 'Bad Request',
                    message: ['name should not be empty', 'name must be a string']
                }
            }
        )
    })

    it('HttpController에서 던지는 예외에는 영향이 없어야 한다', async () => {
        await fix.httpClient
            .get('/throwHttpException')
            .notFound({ error: 'Not Found', message: 'not found exception' })
    })
})
