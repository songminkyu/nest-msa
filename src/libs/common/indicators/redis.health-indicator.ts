import { Injectable } from '@nestjs/common'
import { HealthIndicatorService } from '@nestjs/terminus'
import Redis from 'ioredis'

@Injectable()
export class RedisHealthIndicator {
    constructor(private readonly healthIndicatorService: HealthIndicatorService) {}

    async isHealthy(key: string, redis: Redis) {
        const indicator = this.healthIndicatorService.check(key)

        try {
            const pong = await redis.ping()

            if (pong === 'PONG') {
                return indicator.up()
            }

            return indicator.down({ reason: `Redis ping returned unexpected response: ${pong}` })
        } catch (error) {
            const reason = error.message ?? error
            return indicator.down({ reason })
        }
    }
}
