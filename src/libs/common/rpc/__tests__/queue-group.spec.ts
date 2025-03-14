import { withTestId } from 'testlib'
import type { Fixture } from './queue-group.fixture'
import { sleep } from 'common'

describe('ClientProxyService', () => {
    let fix: Fixture
    let queueSpy: jest.SpyInstance
    let broadcastSpy: jest.SpyInstance

    beforeEach(async () => {
        const { createFixture, MessageController } = await import('./queue-group.fixture')

        queueSpy = jest.spyOn(MessageController.prototype, 'processQueueLogic')
        broadcastSpy = jest.spyOn(MessageController.prototype, 'processBroadcastLogic')

        fix = await createFixture()
    })

    afterEach(async () => {
        await fix?.teardown()
    })

    it('queue 그룹을 설정하면 메시지가 한 인스턴스에만 전달된다', async () => {
        const result = await fix.rpcClient.getJson(withTestId('subject.queue'), {})

        expect(result).toEqual({ result: 'success' })
        expect(queueSpy).toHaveBeenCalledTimes(1)
    })

    it('queue 그룹을 설정하지 않으면 메시지가 전체 인스턴스에 전달된다', async () => {
        const result = await fix.rpcClient.getJson(withTestId('subject.broadcast'), {})
        await sleep(1000)

        expect(result).toEqual({ result: 'success' })
        expect(broadcastSpy).toHaveBeenCalledTimes(fix.numberOfInstance)
    })
})
