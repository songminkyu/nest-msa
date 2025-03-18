import { Module } from '@nestjs/common'
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core'
import { ExceptionLoggerFilter, SuccessLoggingInterceptor } from 'common'
import { AppValidationPipe } from 'shared'

@Module({
    providers: [
        { provide: APP_PIPE, useClass: AppValidationPipe },
        { provide: APP_FILTER, useClass: ExceptionLoggerFilter },
        { provide: APP_INTERCEPTOR, useClass: SuccessLoggingInterceptor }
    ]
})
export class PipesModule {}
