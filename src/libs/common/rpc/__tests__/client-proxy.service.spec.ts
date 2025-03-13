import { withTestId } from 'testlib'
import { Fixture } from './client-proxy.service.fixture'

describe('ClientProxyService', () => {
    let fix: Fixture

    beforeEach(async () => {
        const { createFixture } = await import('./client-proxy.service.fixture')
        fix = await createFixture()
    })

    afterEach(async () => {
        await fix?.teardown()
    })

    describe('send', () => {
        it('HttpController는 Observable로 응답해야 한다', async () => {
            await fix.httpClient.get('/observable').ok({ result: 'success' })
        })

        it('HttpController는 Observable의 값을 반환해야 한다', async () => {
            await fix.httpClient.get('/value').ok({ result: 'success' })
        })

        it('null payload를 보내야 한다', async () => {
            const response = await fix.rpcClient.getJson(withTestId('subject.method'), null)
            expect(response).toEqual({ result: 'success' })
        })
    })

    describe('emit', () => {
        it('Microservice에 이벤트를 전송해야 한다', async () => {
            const promise = new Promise((resolve, reject) => {
                fix.httpClient.get('/handle-event').sse((value) => resolve(value), reject)
            })

            await fix.rpcClient.emit(withTestId('subject.emitEvent'), { arg: 'value' })

            await expect(promise).resolves.toEqual('{"arg":"value"}')
        })

        it('null payload를 보내야 한다', async () => {
            await fix.rpcClient.emit(withTestId('subject.emitEvent'), null)
        })
    })
})
