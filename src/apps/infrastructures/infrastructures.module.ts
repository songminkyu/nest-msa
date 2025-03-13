import { Module } from '@nestjs/common'
import { APP_PIPE } from '@nestjs/core'
import { AppValidationPipe, CommonModule, MongooseConfigModule } from 'shared'
import { HealthModule } from './modules'
import { PaymentsModule, StorageFilesModule } from './services'

@Module({
    imports: [
        CommonModule,
        MongooseConfigModule,
        HealthModule,
        PaymentsModule,
        StorageFilesModule
    ],
    providers: [{ provide: APP_PIPE, useClass: AppValidationPipe }]
})
export class InfrastructuresModule {}
