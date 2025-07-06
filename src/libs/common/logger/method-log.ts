import { Logger, LogLevel } from '@nestjs/common'
import { catchError, isObservable, tap } from 'rxjs'
import { generateShortId } from '../utils'

export interface MethodLogOptions {
    level?: LogLevel
    excludeArgs?: string[]
}

const getParameterNames = (func: (...args: any[]) => any) => {
    const STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/gm
    const ARGUMENT_NAMES = /([^\s,]+)/g
    const fnStr = func.toString().replace(STRIP_COMMENTS, '')
    const result = fnStr.slice(fnStr.indexOf('(') + 1, fnStr.indexOf(')')).match(ARGUMENT_NAMES)
    return result || []
}

export function MethodLog(options: MethodLogOptions = {}): MethodDecorator {
    const { level = 'log', excludeArgs = [] } = options

    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value
        const className = target.constructor.name
        const logger = new Logger(className)

        function wrappedMethod(...args: any[]) {
            const paramNames = getParameterNames(originalMethod)
            const filteredArgs = args.filter((_, index) => !excludeArgs.includes(paramNames[index]))
            const start = Date.now()
            const callId = generateShortId(10)
            logger[level](`Begin ${className}.${propertyKey}.${callId}`, { args: filteredArgs })

            let result
            try {
                result = originalMethod.apply(this, args)
            } catch (error) {
                logger.error(`Error ${className}.${propertyKey}.${callId}`, {
                    args: filteredArgs,
                    error: error.message,
                    duration: Date.now() - start
                })
                throw error
            }

            // Promise
            if (result instanceof Promise) {
                result
                    .then((value) => {
                        logger[level](`End ${className}.${propertyKey}.${callId}`, {
                            args: filteredArgs,
                            return: value,
                            duration: Date.now() - start
                        })
                    })
                    .catch((error) => {
                        logger.error(`Error ${className}.${propertyKey}.${callId}`, {
                            args: filteredArgs,
                            error: error.message,
                            duration: Date.now() - start
                        })
                    })
                return result
            }
            // Observable
            else if (isObservable(result)) {
                return result.pipe(
                    tap((value) => {
                        logger[level](`End ${className}.${propertyKey}.${callId}`, {
                            args: filteredArgs,
                            return: value,
                            duration: Date.now() - start
                        })
                    }),
                    catchError((error) => {
                        logger.error(`Error ${className}.${propertyKey}.${callId}`, {
                            args: filteredArgs,
                            error: error.message,
                            duration: Date.now() - start
                        })
                        throw error
                    })
                )
            }
            // synchronous
            else {
                logger[level](`End ${className}.${propertyKey}.${callId}`, {
                    args: filteredArgs,
                    return: result,
                    duration: Date.now() - start
                })
                return result
            }
        }

        // Copy all metadata from the original method to the wrapped method so that other decorators are unaffected
        // 다른 데코레이터가 영향을 받지 않도록 원본 메서드에 설정된 모든 메타데이터를 wrappedMethod로 복사
        const metadataKeys = Reflect.getMetadataKeys(originalMethod)
        for (const key of metadataKeys) {
            const metadata = Reflect.getMetadata(key, originalMethod)
            Reflect.defineMetadata(key, metadata, wrappedMethod)
        }

        descriptor.value = wrappedMethod
    }
}
