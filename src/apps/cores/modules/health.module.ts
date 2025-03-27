import { getRedisConnectionToken } from '@nestjs-modules/ioredis'
import { Controller, Get, Inject, Injectable, Module } from '@nestjs/common'
import { getConnectionToken } from '@nestjs/mongoose'
import { HealthCheckService, MongooseHealthIndicator, TerminusModule } from '@nestjs/terminus'
import { RedisHealthIndicator } from 'common'
import Redis from 'ioredis'
import mongoose from 'mongoose'

@Injectable()
class HealthService {
    constructor(
        private health: HealthCheckService,
        private mongoose: MongooseHealthIndicator,
        private redis: RedisHealthIndicator,
        @Inject(getConnectionToken()) private mongoConn: mongoose.Connection,
        @Inject(getRedisConnectionToken()) private redisConn: Redis
    ) {}

    check() {
        const checks = [
            async () => this.mongoose.pingCheck('MongoDB', { connection: this.mongoConn }),
            async () => this.redis.isHealthy('redis', this.redisConn)
        ]

        return this.health.check(checks)
    }
}

@Controller()
class HealthController {
    constructor(private service: HealthService) {}

    @Get('health')
    health() {
        return this.service.check()
    }
}

@Module({
    imports: [TerminusModule],
    providers: [HealthService, RedisHealthIndicator],
    controllers: [HealthController]
})
export class HealthModule {}
