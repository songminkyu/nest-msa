import { Module } from '@nestjs/common'
import { PurchasesServiceProxy, ShowtimesProxy, TicketHoldingProxy, TicketsProxy } from 'apps/cores'
import { TicketPurchaseProcessor } from './processors'
import { PurchaseProcessServiceProxy } from './purchase-process-service.proxy'
import { PurchaseProcessController } from './purchase-process.controller'
import { PurchaseProcessService } from './purchase-process.service'

@Module({
    providers: [
        PurchaseProcessService,
        TicketPurchaseProcessor,
        PurchaseProcessServiceProxy,
        TicketsProxy,
        TicketHoldingProxy,
        PurchasesServiceProxy,
        ShowtimesProxy
    ],
    controllers: [PurchaseProcessController]
})
export class PurchaseProcessModule {}
