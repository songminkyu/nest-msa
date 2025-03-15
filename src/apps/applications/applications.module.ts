import { getRedisConnectionToken } from '@nestjs-modules/ioredis'
import { BullModule } from '@nestjs/bullmq'
import { Module } from '@nestjs/common'
import Redis from 'ioredis'
import {
    CommonModule,
    ProjectName,
    RedisConfig,
    RedisConfigModule,
    uniqueWhenTesting
} from 'shared'
import { HealthModule, PipesModule } from './modules'
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
                prefix: `{queue:${uniqueWhenTesting(ProjectName)}}`,
                connection: redis
            }),
            inject: [getRedisConnectionToken(RedisConfig.connName)]
        }),
        ShowtimeCreationModule,
        RecommendationModule,
        BookingModule,
        PurchaseProcessModule,
        PipesModule
    ]
})
export class ApplicationsModule {}
