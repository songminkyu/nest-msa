import { Module } from '@nestjs/common'
import { PurchasesProxy, ShowtimesProxy, TicketHoldingProxy, TicketsProxy } from 'apps/cores'
import { TicketPurchaseProcessor } from './processors'
import { PurchaseProcessProxy } from './purchase-process.client'
import { PurchaseProcessController } from './purchase-process.controller'
import { PurchaseProcessService } from './purchase-process.service'

@Module({
    providers: [
        PurchaseProcessService,
        TicketPurchaseProcessor,
        PurchaseProcessProxy,
        TicketsProxy,
        TicketHoldingProxy,
        PurchasesProxy,
        ShowtimesProxy
    ],
    controllers: [PurchaseProcessController]
})
export class PurchaseProcessModule {}
