import {
    CallHandler,
    ExecutionContext,
    Inject,
    Injectable,
    Logger,
    NestInterceptor,
    Optional
} from '@nestjs/common'
import { Request, Response } from 'express'
import { Observable } from 'rxjs'
import { tap } from 'rxjs/operators'

@Injectable()
export class SuccessLoggingInterceptor implements NestInterceptor {
    constructor(
        @Optional()
        @Inject('LOGGING_EXCLUDE_HTTP_PATHS')
        private readonly excludeHttpPaths: string[] | undefined,
        @Optional()
        @Inject('LOGGING_EXCLUDE_RPC_PATHS')
        private readonly excludeRpcPaths: string[] | undefined
    ) {}

    private shouldHttpLog(url: string): boolean {
        if (this.excludeHttpPaths === undefined) return true

        return !this.excludeHttpPaths.some((exclude) => url === exclude)
    }

    private shouldRpcLog(args: string[]): boolean {
        if (this.excludeRpcPaths === undefined) return true

        return !this.excludeRpcPaths.some((exclude) => args.includes(exclude))
    }

    async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
        const now = Date.now()

        const contextType = context.getType()

        return next.handle().pipe(
            tap({
                complete: () => {
                    if (contextType === 'http') {
                        const http = context.switchToHttp()
                        const response = http.getResponse<Response>()
                        const { method, url, body } = http.getRequest<Request>()

                        if (this.shouldHttpLog(url)) {
                            Logger.verbose('success', {
                                contextType,
                                statusCode: response.statusCode,
                                request: { method, url, body },
                                duration: `${Date.now() - now}ms`
                            })
                        }
                    } else if (contextType === 'rpc') {
                        const rpc = context.switchToRpc()
                        const rpcContext = rpc.getContext()
                        const rpcData = rpc.getData()

                        if (this.shouldRpcLog(rpcContext.args)) {
                            Logger.verbose('success', {
                                contextType,
                                context: rpcContext,
                                data: rpcData,
                                duration: `${Date.now() - now}ms`
                            })
                        }
                    } else {
                        Logger.error('unknown context type', {
                            contextType,
                            duration: `${Date.now() - now}ms`
                        })
                    }
                }
            })
        )
    }
}
