import { Injectable } from '@nestjs/common'
import { ClientProxyService, InjectClientProxy } from 'common'
import { Messages } from 'shared'
import { CreatePurchaseDto, PurchaseDto } from './dtos'

@Injectable()
export class PurchasesClient {
    constructor(@InjectClientProxy() private proxy: ClientProxyService) {}

    createPurchase(createDto: CreatePurchaseDto): Promise<PurchaseDto> {
        return this.proxy.getJson(Messages.Purchases.createPurchase, createDto)
    }

    getPurchases(purchaseIds: string[]): Promise<PurchaseDto[]> {
        return this.proxy.getJson(Messages.Purchases.getPurchases, purchaseIds)
    }
}
