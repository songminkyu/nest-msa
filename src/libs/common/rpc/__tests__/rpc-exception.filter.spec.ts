import { HttpException, InternalServerErrorException, NotFoundException } from '@nestjs/common'
import {  HttpTestClient, RpcTestClient, withTestId } from 'testlib'

describe('HttpToRpcExceptionFilter', () => {
    let teardown = () => {}
    let httpClient: HttpTestClient
    let rpcClient: RpcTestClient

    beforeEach(async () => {
        const { createFixture } = await import('./rpc-exception.filter.fixture')

        const fixture = await createFixture()
        teardown = fixture.teardown
        httpClient = fixture.httpClient
        rpcClient = fixture.client
    })

    afterEach(async () => {
        await teardown()
    })

    // TODO new NotFoundException 이렇게 인스턴스를 비교하면 안 된다
    it('RpcController에서 던지는 HttpException이 복원되어야 한다', async () => {
        await rpcClient.error(
            withTestId('subject.throwHttpException'),
            {},
            new NotFoundException('not found exception')
        )
    })

    it('RpcController에서 던지는 Error가 복원되어야 한다', async () => {
        await rpcClient.error(
            withTestId('subject.throwError'),
            {},
            new InternalServerErrorException('error message')
        )
    })

    it('HttpController에서 던지는 예외에는 영향이 없어야 한다', async () => {
        await httpClient
            .get('/throwHttpException')
            .notFound({ error: 'Not Found', message: 'not found exception' })
    })

    it('잘못된 데이터 형식에 대해 입력을 검증하고 오류를 반환해야 한다', async () => {
        await rpcClient.error(
            withTestId('subject.verifyDto'),
            { wrong: 'wrong field' },
            new HttpException(
                {
                    error: 'Bad Request',
                    message: ['name should not be empty', 'name must be a string']
                },
                400
            )
        )
    })
})
