import { Module } from '@nestjs/common'
import { APP_FILTER, APP_PIPE } from '@nestjs/core'
import { RpcExceptionFilter } from 'common'
import { AppValidationPipe } from 'shared'

@Module({
    providers: [
        { provide: APP_PIPE, useClass: AppValidationPipe },
        { provide: APP_FILTER, useClass: RpcExceptionFilter }
    ]
})
export class PipesModule {}
