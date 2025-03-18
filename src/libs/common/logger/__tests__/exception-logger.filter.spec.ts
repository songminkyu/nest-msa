import { withTestId } from 'testlib'
import type { Fixture } from './exception-logger.filter.fixture'

describe('ExceptionLoggerFilter', () => {
    let fix: Fixture

    beforeEach(async () => {
        const { createFixture } = await import('./exception-logger.filter.fixture')
        fix = await createFixture()
    })

    afterEach(async () => {
        await fix?.teardown()
    })

    it('HttpController에서 HttpException을 던지면 Logger.warn()으로 기록해야 한다', async () => {
        await fix.httpClient.get('/exception').notFound({ code: 'ERR_CODE', message: 'message' })

        expect(fix.spyWarn).toHaveBeenCalledTimes(1)
        expect(fix.spyWarn).toHaveBeenCalledWith('fail', 'HTTP', {
            statusCode: 404,
            request: { method: 'GET', url: '/exception' },
            response: { code: 'ERR_CODE', message: 'message' },
            stack: expect.any(String)
        })
    })

    it('HttpController에서 Error을 던지면 Logger.error()으로 기록해야 한다', async () => {
        await fix.httpClient.get('/error').internalServerError()

        expect(fix.spyError).toHaveBeenCalledTimes(1)
        expect(fix.spyError).toHaveBeenCalledWith('error', 'HTTP', {
            statusCode: 500,
            request: { method: 'GET', url: '/error' },
            response: { message: 'error message' },
            stack: expect.any(String)
        })
    })

    it('RpcController에서 HttpException을 던지면 Logger.warn()으로 기록해야 한다', async () => {
        const subject = withTestId('exception')
        await fix.rpcClient.error(
            subject,
            {},
            expect.objectContaining({
                response: { code: 'ERR_CODE', message: 'message' },
                status: 404
            })
        )

        expect(fix.spyWarn).toHaveBeenCalledTimes(1)
        expect(fix.spyWarn).toHaveBeenCalledWith('fail', 'RPC', {
            context: { args: [subject] },
            data: {},
            response: { code: 'ERR_CODE', message: 'message' },
            stack: expect.any(String)
        })
    })

    it('RpcController에서 Error을 던지면 Logger.error()으로 기록해야 한다', async () => {
        const subject = withTestId('error')
        await fix.rpcClient.error(subject, {}, Error('error message'))

        expect(fix.spyError).toHaveBeenCalledTimes(1)
        expect(fix.spyError).toHaveBeenCalledWith('error', 'RPC', {
            context: { args: [subject] },
            data: {},
            message: 'error message',
            stack: expect.any(String)
        })
    })

    it('알 수 없는 ContextType이면 Logger.error()로 기록해야 한다', async () => {
        const { ExecutionContextHost } = await import('@nestjs/core/helpers/execution-context-host')
        jest.spyOn(ExecutionContextHost.prototype, 'getType').mockReturnValue('unknown')

        await fix.httpClient.get('/exception').notFound()

        expect(fix.spyError).toHaveBeenCalledTimes(1)
        expect(fix.spyError).toHaveBeenCalledWith(
            'unknown context type',
            'unknown',
            expect.objectContaining({})
        )
    })
})
