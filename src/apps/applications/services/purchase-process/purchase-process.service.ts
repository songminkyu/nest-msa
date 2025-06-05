import { Injectable } from '@nestjs/common'
import { CreatePurchaseDto, PurchasesClient } from 'apps/cores'
import { TicketPurchaseProcessor } from './processors'

@Injectable()
export class PurchaseProcessService {
    constructor(
        private purchasesService: PurchasesClient,
        private ticketProcessor: TicketPurchaseProcessor
    ) {}

    async processPurchase(createDto: CreatePurchaseDto) {
        await this.ticketProcessor.validatePurchase(createDto)

        const purchase = await this.purchasesService.createPurchase(createDto)

        try {
            await this.ticketProcessor.completePurchase(createDto)

            return purchase
        } catch (error) {
            await this.ticketProcessor.rollbackPurchase(createDto)
            throw error
        }
    }
}
