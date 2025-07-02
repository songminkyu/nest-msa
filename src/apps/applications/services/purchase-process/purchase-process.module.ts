import { Module } from '@nestjs/common'
import { PurchasesClient, ShowtimesClient, TicketHoldingClient, TicketsClient } from 'apps/cores'
import { TicketPurchaseProcessor } from './processors'
import { PurchaseProcessClient } from './purchase-process.client'
import { PurchaseProcessController } from './purchase-process.controller'
import { PurchaseProcessEvents } from './purchase-process.events'
import { PurchaseProcessService } from './purchase-process.service'

@Module({
    providers: [
        PurchaseProcessService,
        TicketPurchaseProcessor,
        PurchaseProcessClient,
        PurchaseProcessEvents,
        TicketsClient,
        TicketHoldingClient,
        PurchasesClient,
        ShowtimesClient
    ],
    controllers: [PurchaseProcessController]
})
export class PurchaseProcessModule {}
