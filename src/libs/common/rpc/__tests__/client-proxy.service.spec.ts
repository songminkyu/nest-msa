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
        it('Should respond with an Observable in the HttpController', async () => {
            await fix.httpClient.get('/observable').ok({ result: 'success' })
        })

        /* HttpController는 Observable의 값을 반환해야 한다 */
        it('Should return the value of the Observable in the HttpController', async () => {
            await fix.httpClient.get('/value').ok({ result: 'success' })
        })

        /* null payload를 보내야 한다 */
        it('Should send a null payload', async () => {
            const response = await fix.rpcClient.getJson(withTestId('method'), null)
            expect(response).toEqual({ result: 'success' })
        })
    })

    describe('emit', () => {
        /* Microservice에 이벤트를 전송해야 한다 */
        it('Should send an event to the microservice', async () => {
            const promise = new Promise((resolve, reject) => {
                fix.httpClient.get('/handle-event').sse((value) => resolve(value), reject)
            })

            await fix.rpcClient.emit(withTestId('emitEvent'), { arg: 'value' })

            await expect(promise).resolves.toEqual('{"arg":"value"}')
        })

        /* null payload를 보내야 한다 */
        it('Should send a null payload', async () => {
            await fix.rpcClient.emit(withTestId('emitEvent'), null)
        })
    })
})
