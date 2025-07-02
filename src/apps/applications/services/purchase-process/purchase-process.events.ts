import { Injectable } from '@nestjs/common'
import { ClientProxyService, InjectClientProxy } from 'common'
import { Events } from 'shared'

@Injectable()
export class PurchaseProcessEvents {
    constructor(@InjectClientProxy() private proxy: ClientProxyService) {}

    emitTicketPurchased(customerId: string, ticketIds: string[]) {
        return this.proxy.emit(Events.PurchaseProcess.TicketPurchased, {
            customerId,
            ticketIds
        })
    }

    emitTicketPurchaseCanceled(customerId: string, ticketIds: string[]) {
        return this.proxy.emit(Events.PurchaseProcess.TicketPurchaseCanceled, {
            customerId,
            ticketIds
        })
    }
}
