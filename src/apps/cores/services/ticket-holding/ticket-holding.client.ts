import { Injectable } from '@nestjs/common'
import { ClientProxyService, InjectClientProxy } from 'common'
import { Messages } from 'shared'
import { TicketHoldDto } from './dtos'

@Injectable()
export class TicketHoldingClient {
    constructor(@InjectClientProxy() private proxy: ClientProxyService) {}

    holdTickets(holdDto: TicketHoldDto): Promise<boolean> {
        return this.proxy.getJson(Messages.TicketHolding.holdTickets, holdDto)
    }

    findHeldTicketIds(showtimeId: string, customerId: string): Promise<string[]> {
        return this.proxy.getJson(Messages.TicketHolding.findHeldTicketIds, {
            showtimeId,
            customerId
        })
    }
}
