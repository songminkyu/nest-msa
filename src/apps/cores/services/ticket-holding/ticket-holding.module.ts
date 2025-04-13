import { Module } from '@nestjs/common'
import { CacheModule } from 'common'
import { ProjectName, uniqueWhenTesting } from 'shared'
import { TicketHoldingController } from './ticket-holding.controller'
import { TicketHoldingService } from './ticket-holding.service'

@Module({
    imports: [
        CacheModule.register({
            name: 'ticket-holding',
            prefix: `cache:${uniqueWhenTesting(ProjectName)}`
        })
    ],
    providers: [TicketHoldingService],
    controllers: [TicketHoldingController]
})
export class TicketHoldingModule {}
