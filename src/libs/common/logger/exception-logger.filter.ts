import { ArgumentsHost, Catch, HttpException, Logger } from '@nestjs/common'
import { BaseExceptionFilter } from '@nestjs/core'
import { RpcException } from '@nestjs/microservices'
import { Request } from 'express'
import { throwError } from 'rxjs'
import { HttpErrorLog, RpcErrorLog } from './types'

/**
 * 전역 필터는 1개만 등록 가능하다.
 * 전역 필터를 추가해야 한다면 ExceptionLoggerFilter를 상속 후 super.catch()를 호출한다.
 * 이렇게 상속을 하면 필터의 호출 순서도 명확해진다.
 *
 * class LogTransformerFilter extends ExceptionLoggerFilter{
 *      catch(exception: any, host: ArgumentsHost) {
 *          ...
 *          super.catch(exception, host)
 *      }
 * }
 */
@Catch()
export class ExceptionLoggerFilter extends BaseExceptionFilter {
    catch(exception: any, host: ArgumentsHost) {
        const contextType = host.getType()

        if (contextType === 'http') {
            const http = host.switchToHttp()
            const { method, url, body } = http.getRequest<Request>()

            if (exception instanceof HttpException) {
                const log = {
                    contextType,
                    statusCode: exception.getStatus(),
                    request: { method, url, body },
                    response: exception.getResponse(),
                    stack: exception.stack
                } as HttpErrorLog

                Logger.warn('fail', log)
            } else if (exception instanceof Error) {
                const log = {
                    contextType,
                    statusCode: 500,
                    request: { method, url, body },
                    response: { message: exception.message },
                    stack: exception.stack
                } as HttpErrorLog

                Logger.error('error', log)
            }

            super.catch(exception, host)
        } else if (contextType === 'rpc') {
            const ctx = host.switchToRpc()

            if (exception instanceof HttpException) {
                const log = {
                    contextType,
                    context: ctx.getContext(),
                    data: ctx.getData(),
                    response: exception.getResponse(),
                    stack: exception.stack
                } as RpcErrorLog

                Logger.warn('fail', log)

                return throwError(() => exception)
            } else if (exception instanceof Error) {
                const log = {
                    contextType,
                    context: ctx.getContext(),
                    data: ctx.getData(),
                    response: { message: exception.message },
                    stack: exception.stack
                } as RpcErrorLog

                Logger.error('error', log)

                return throwError(() => new RpcException(exception))
            }
        } else {
            Logger.error('unknown context type', { contextType, ...exception })

            super.catch(exception, host)
        }
    }
}
