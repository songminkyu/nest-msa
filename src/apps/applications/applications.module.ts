import { BullModule } from '@nestjs/bullmq'
import { Module } from '@nestjs/common'
import Redis from 'ioredis'
import { CommonModule, getProjectName, RedisConfigModule } from 'shared'
import { HealthModule } from './modules'
import {
    BookingModule,
    PurchaseProcessModule,
    RecommendationModule,
    ShowtimeCreationModule
} from './services'

@Module({
    imports: [
        CommonModule,
        RedisConfigModule,
        HealthModule,
        BullModule.forRootAsync('queue', {
            useFactory: (redis: Redis) => ({
                prefix: `{queue:${getProjectName()}}`,
                connection: redis
            }),
            inject: [RedisConfigModule.moduleName]
        }),
        ShowtimeCreationModule,
        RecommendationModule,
        BookingModule,
        PurchaseProcessModule
    ]
})
export class ApplicationsModule {}
