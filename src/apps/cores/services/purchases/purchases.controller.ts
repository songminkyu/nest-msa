import { Controller } from '@nestjs/common'
import { MessagePattern, Payload } from '@nestjs/microservices'
import { Messages } from 'shared'
import { CreatePurchaseDto } from './dtos'
import { PurchasesService } from './purchases.service'

@Controller()
export class PurchasesController {
    constructor(private service: PurchasesService) {}

    @MessagePattern(Messages.Purchases.createPurchase)
    createPurchase(@Payload() createDto: CreatePurchaseDto) {
        return this.service.createPurchase(createDto)
    }

    @MessagePattern(Messages.Purchases.getPurchases)
    getPurchases(@Payload() purchaseIds: string[]) {
        return this.service.getPurchases(purchaseIds)
    }
}
