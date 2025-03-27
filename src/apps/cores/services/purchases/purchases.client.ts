import { Injectable } from '@nestjs/common'
import { ClientProxyService, InjectClientProxy } from 'common'
import { Messages } from 'shared'
import { PurchaseCreateDto, PurchaseDto } from './dtos'

@Injectable()
export class PurchasesClient {
    constructor(@InjectClientProxy() private service: ClientProxyService) {}

    createPurchase(createDto: PurchaseCreateDto): Promise<PurchaseDto> {
        return this.service.getJson(Messages.Purchases.createPurchase, createDto)
    }

    getPurchase(purchaseId: string): Promise<PurchaseDto> {
        return this.service.getJson(Messages.Purchases.getPurchase, purchaseId)
    }
}
