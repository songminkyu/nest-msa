import { withTestId } from 'testlib'
import type { Fixture } from './success-logging.interceptor.fixture'
import { Provider } from '@nestjs/common'

describe('SuccessLoggingInterceptor', () => {
    let fix: Fixture
    let createFixture: (providers: Provider[]) => Promise<any>

    beforeEach(async () => {
        const { createFixture: _createFixture } = await import(
            './success-logging.interceptor.fixture'
        )
        createFixture = _createFixture
    })

    afterEach(async () => {
        await fix?.teardown()
    })

    describe('요청 성공 시', () => {
        beforeEach(async () => {
            fix = await createFixture([])
        })

        it('HTTP 요청이 성공하면 Logger.verbose()로 기록해야 한다', async () => {
            const body = { key: 'value' }
            await fix.httpClient.post('/success').body(body).created({ result: 'success' })

            expect(fix.spyVerbose).toHaveBeenCalledTimes(1)
            expect(fix.spyVerbose).toHaveBeenCalledWith('success', 'HTTP', {
                statusCode: 201,
                request: { method: 'POST', url: '/success', body },
                duration: expect.any(String)
            })
        })

        it('RPC 요청이 성공하면 Logger.verbose()로 기록해야 한다', async () => {
            const subject = withTestId('subject.success')
            const data = { key: 'value' }
            await fix.rpcClient.expect(subject, data, { result: 'success' })

            expect(fix.spyVerbose).toHaveBeenCalledTimes(1)
            expect(fix.spyVerbose).toHaveBeenCalledWith('success', 'RPC', {
                context: { args: [subject] },
                data,
                duration: expect.any(String)
            })
        })

        it('알 수 없는 ContextType이면 Logger.error()로 기록해야 한다', async () => {
            const { ExecutionContextHost } = await import(
                '@nestjs/core/helpers/execution-context-host'
            )
            jest.spyOn(ExecutionContextHost.prototype, 'getType').mockReturnValue('unknown')

            await fix.httpClient.get('/exclude-path').ok()

            expect(fix.spyError).toHaveBeenCalledTimes(1)
            expect(fix.spyError).toHaveBeenCalledWith('unknown context type', 'unknown', {
                duration: expect.any(String)
            })
        })
    })

    describe('LOGGING_EXCLUDE_HTTP_PATHS', () => {
        beforeEach(async () => {
            fix = await createFixture([
                { provide: 'LOGGING_EXCLUDE_HTTP_PATHS', useValue: ['/exclude-path'] }
            ])
        })

        it('지정된 HTTP 경로는 무시해야 한다', async () => {
            await fix.httpClient.get('/exclude-path').ok({ result: 'success' })

            expect(fix.spyVerbose).toHaveBeenCalledTimes(0)
        })
    })

    describe('LOGGING_EXCLUDE_RPC_PATHS', () => {
        beforeEach(async () => {
            fix = await createFixture([
                { provide: 'LOGGING_EXCLUDE_RPC_PATHS', useValue: [withTestId('exclude-path')] }
            ])
        })

        it('지정된 RPC 경로는 무시해야 한다', async () => {
            const subject = withTestId('exclude-path')
            const data = { key: 'value' }
            await fix.rpcClient.expect(subject, data, { result: 'success' })

            expect(fix.spyVerbose).toHaveBeenCalledTimes(0)
        })
    })
})
