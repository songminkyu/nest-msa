import { lastValueFrom } from 'rxjs'
import { TestService } from './method-log.fixture'

describe('@MethodLog()', () => {
    let service: TestService
    let spyLog: jest.SpyInstance
    let spyError: jest.SpyInstance
    let spyDebug: jest.SpyInstance

    beforeEach(async () => {
        const { TestService } = await import('./method-log.fixture')
        service = new TestService()

        const { Logger } = await import('@nestjs/common')
        spyLog = jest.spyOn(Logger.prototype, 'log').mockImplementation(() => {})
        spyError = jest.spyOn(Logger.prototype, 'error').mockImplementation(() => {})
        spyDebug = jest.spyOn(Logger.prototype, 'debug').mockImplementation(() => {})
    })

    it('동기 메서드의 시작과 종료를 로깅해야 한다', async () => {
        service.syncMethod('value')

        expect(spyLog).toHaveBeenNthCalledWith(
            1,
            expect.stringContaining('Begin TestService.syncMethod'),
            { args: ['value'] }
        )

        expect(spyLog).toHaveBeenNthCalledWith(
            2,
            expect.stringContaining('End TestService.syncMethod'),
            { args: ['value'], duration: expect.any(Number), return: 'value' }
        )
    })

    it('비동기 메서드의 시작과 완료를 로깅해야 한다', async () => {
        await service.asyncMethod('value')

        expect(spyLog).toHaveBeenNthCalledWith(
            1,
            expect.stringContaining('Begin TestService.asyncMethod'),
            { args: ['value'] }
        )

        expect(spyLog).toHaveBeenNthCalledWith(
            2,
            expect.stringContaining('End TestService.asyncMethod'),
            { args: ['value'], duration: expect.any(Number), return: 'value' }
        )
    })

    it('Observable 메서드의 시작과 완료를 로깅해야 한다', async () => {
        await lastValueFrom(service.observableMethod('value'))

        expect(spyLog).toHaveBeenNthCalledWith(
            1,
            expect.stringContaining('Begin TestService.observableMethod'),
            { args: ['value'] }
        )

        expect(spyLog).toHaveBeenNthCalledWith(
            2,
            expect.stringContaining('End TestService.observableMethod'),
            { args: ['value'], duration: expect.any(Number), return: 'value' }
        )
    })

    it('동기 메서드 실행 중 발생한 오류를 로깅해야 한다', () => {
        expect(() => service.throwSyncError('value')).toThrow('value')

        expect(spyLog).toHaveBeenNthCalledWith(
            1,
            expect.stringContaining('Begin TestService.throwSyncError'),
            { args: ['value'] }
        )

        expect(spyError).toHaveBeenCalledWith(
            expect.stringContaining('Error TestService.throwSyncError'),
            { args: ['value'], duration: expect.any(Number), error: 'value' }
        )
    })

    it('비동기 메서드 실행 중 발생한 오류를 로깅해야 한다', async () => {
        await expect(service.throwAsyncError('value')).rejects.toThrow()

        expect(spyLog).toHaveBeenNthCalledWith(
            1,
            expect.stringContaining('Begin TestService.throwAsyncError'),
            { args: ['value'] }
        )

        expect(spyError).toHaveBeenCalledWith(
            expect.stringContaining('Error TestService.throwAsyncError'),
            { args: ['value'], duration: expect.any(Number), error: 'value' }
        )
    })

    it('Observable 메서드 실행 중 발생한 오류를 로깅해야 한다', async () => {
        await expect(lastValueFrom(service.throwObservableError('value'))).rejects.toThrow()

        expect(spyLog).toHaveBeenNthCalledWith(
            1,
            expect.stringContaining('Begin TestService.throwObservableError'),
            { args: ['value'] }
        )

        expect(spyError).toHaveBeenCalledWith(
            expect.stringContaining('Error TestService.throwObservableError'),
            { args: ['value'], duration: expect.any(Number), error: 'value' }
        )
    })

    it('지정된 로깅 레벨로 메서드를 기록해야 한다', () => {
        service.debugLog()

        expect(spyDebug).toHaveBeenNthCalledWith(
            1,
            expect.stringContaining('Begin TestService.debugLog'),
            { args: [] }
        )

        expect(spyDebug).toHaveBeenNthCalledWith(
            2,
            expect.stringContaining('End TestService.debugLog'),
            { args: [], duration: expect.any(Number), return: 'value' }
        )
    })

    it('excludeArgs로 설정한 전달인자는 기록하지 않아야 한다', () => {
        service.excludeArgs('1', '2')

        expect(spyLog).toHaveBeenNthCalledWith(
            1,
            expect.stringContaining('Begin TestService.excludeArgs'),
            { args: ['1'] }
        )

        expect(spyLog).toHaveBeenNthCalledWith(
            2,
            expect.stringContaining('End TestService.excludeArgs'),
            { args: ['1'], duration: expect.any(Number), return: '1+2' }
        )
    })

    it('다른 데코레이터와 함께 사용해도 정상적으로 로깅되어야 한다', () => {
        service.nestedDecorator()

        expect(spyLog).toHaveBeenNthCalledWith(
            2,
            expect.stringContaining('End TestService.nestedDecorator'),
            { args: [], duration: expect.any(Number), return: 'value' }
        )
    })
})
