import { getRedisConnectionToken } from '@nestjs-modules/ioredis'
import { BullModule } from '@nestjs/bullmq'
import { Module } from '@nestjs/common'
import { APP_PIPE } from '@nestjs/core'
import Redis from 'ioredis'
import { AppValidationPipe, CommonModule, ProjectName, RedisConfig, RedisConfigModule, uniqueWhenTesting } from 'shared'
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
                prefix: `{queue:${uniqueWhenTesting(ProjectName)}}`,
                connection: redis
            }),
            inject: [getRedisConnectionToken(RedisConfig.connName)]
        }),
        ShowtimeCreationModule,
        RecommendationModule,
        BookingModule,
        PurchaseProcessModule
    ],
    providers: [{ provide: APP_PIPE, useClass: AppValidationPipe }]
})
export class ApplicationsModule {}
