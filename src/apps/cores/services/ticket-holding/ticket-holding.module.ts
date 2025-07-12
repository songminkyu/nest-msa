import { Module } from '@nestjs/common'
import { CacheModule } from 'common'
import { ProjectName, RedisConfigModule, makeName } from 'shared'
import { TicketHoldingController } from './ticket-holding.controller'
import { TicketHoldingService } from './ticket-holding.service'

@Module({
    imports: [
        CacheModule.register({
            name: 'ticket-holding',
            redisName: RedisConfigModule.connectionName,
            prefix: `cache:${makeName(ProjectName)}`
        })
    ],
    providers: [TicketHoldingService],
    controllers: [TicketHoldingController]
})
export class TicketHoldingModule {}
