import { Injectable } from '@nestjs/common'
import { CreatePurchaseDto, PurchaseDto } from 'apps/cores'
import { ClientProxyService, InjectClientProxy } from 'common'
import { Events, Messages } from 'shared'

@Injectable()
export class PurchaseProcessClient {
    constructor(@InjectClientProxy() private proxy: ClientProxyService) {}

    processPurchase(createDto: CreatePurchaseDto): Promise<PurchaseDto> {
        return this.proxy.getJson(Messages.PurchaseProcess.processPurchase, createDto)
    }

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
