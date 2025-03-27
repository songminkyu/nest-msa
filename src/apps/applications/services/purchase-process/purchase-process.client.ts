import { Injectable } from '@nestjs/common'
import { PurchaseCreateDto, PurchaseDto } from 'apps/cores'
import { ClientProxyService, InjectClientProxy } from 'common'
import { Messages } from 'shared'

@Injectable()
export class PurchaseProcessClient {
    constructor(@InjectClientProxy() private proxy: ClientProxyService) {}

    processPurchase(createDto: PurchaseCreateDto): Promise<PurchaseDto> {
        return this.proxy.getJson(Messages.PurchaseProcess.processPurchase, createDto)
    }

    emitTicketPurchased(customerId: string, ticketIds: string[]) {
        return this.proxy.emit(Messages.PurchaseProcess.TicketPurchased, {
            customerId,
            ticketIds
        })
    }

    emitTicketPurchaseCanceled(customerId: string, ticketIds: string[]) {
        return this.proxy.emit(Messages.PurchaseProcess.TicketPurchaseCanceled, {
            customerId,
            ticketIds
        })
    }
}
