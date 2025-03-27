import { Injectable } from '@nestjs/common'
import { ClientProxyService, InjectClientProxy } from 'common'
import { Messages } from 'shared'
import { PurchaseCreateDto, PurchaseDto } from './dtos'

@Injectable()
export class PurchasesClient {
    constructor(@InjectClientProxy() private proxy: ClientProxyService) {}

    createPurchase(createDto: PurchaseCreateDto): Promise<PurchaseDto> {
        return this.proxy.getJson(Messages.Purchases.createPurchase, createDto)
    }

    getPurchase(purchaseId: string): Promise<PurchaseDto> {
        return this.proxy.getJson(Messages.Purchases.getPurchase, purchaseId)
    }
}
