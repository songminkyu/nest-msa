import { Module } from '@nestjs/common'
import { CommonModule, MongooseConfigModule } from 'shared'
import { HealthModule, PipesModule } from './modules'
import { PaymentsModule, StorageFilesModule } from './services'

@Module({
    imports: [
        CommonModule,
        MongooseConfigModule,
        HealthModule,
        PaymentsModule,
        StorageFilesModule,
        PipesModule
    ]
})
export class InfrastructuresModule {}
