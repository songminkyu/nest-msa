import { withTestId } from 'testlib'
import type { Fixture } from './client-proxy.service.fixture'

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
        /* HttpController는 Observable로 응답해야 한다 */
        it('should respond with an Observable in the HttpController', async () => {
            await fix.httpClient.get('/observable').ok({ result: 'success' })
        })

        /* HttpController는 Observable의 값을 반환해야 한다 */
        it('should return the value of the Observable in the HttpController', async () => {
            await fix.httpClient.get('/value').ok({ result: 'success' })
        })

        /* null payload를 보내야 한다 */
        it('should send a null payload', async () => {
            const response = await fix.rpcClient.getJson(withTestId('method'), null)
            expect(response).toEqual({ result: 'success' })
        })
    })

    describe('emit', () => {
        /* Microservice에 이벤트를 전송해야 한다 */
        it('should send an event to the microservice', async () => {
            // TODO console.log 삭제
            console.log('Emit Test #1')
            const promise = new Promise((resolve, reject) => {
                console.log('Emit Test #2')
                fix.httpClient.get('/handle-event').sse((value) => resolve(value), reject)
                console.log('Emit Test #3')
            })

            console.log('Emit Test #4')
            await fix.rpcClient.emit(withTestId('emitEvent'), { arg: 'value' })

            console.log('Emit Test #5')
            await expect(promise).resolves.toEqual('{"arg":"value"}')
            console.log('Emit Test #6')
        })

        /* null payload를 보내야 한다 */
        it('should send a null payload', async () => {
            await fix.rpcClient.emit(withTestId('emitEvent'), null)
        })
    })
})
