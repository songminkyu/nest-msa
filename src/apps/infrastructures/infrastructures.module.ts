import { Module } from '@nestjs/common'
import { CommonModule, MongooseConfigModule } from 'shared'
import { HealthModule } from './modules'
import { PaymentsModule, StorageFilesModule } from './services'

@Module({
    imports: [CommonModule, MongooseConfigModule, HealthModule, PaymentsModule, StorageFilesModule]
})
export class InfrastructuresModule {}
