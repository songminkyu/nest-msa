import { Controller, Get, Inject, Injectable, Module } from '@nestjs/common'
import { HealthCheckService, TerminusModule } from '@nestjs/terminus'
import { RedisHealthIndicator } from 'common'
import Redis from 'ioredis'
import { RedisConfigModule } from 'shared'

@Injectable()
class HealthService {
    constructor(
        private health: HealthCheckService,
        private redis: RedisHealthIndicator,
        @Inject(RedisConfigModule.moduleName) private redisConn: Redis
    ) {}

    check() {
        const checks = [async () => this.redis.isHealthy('redis', this.redisConn)]

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
