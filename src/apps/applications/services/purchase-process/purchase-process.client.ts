import { Injectable } from '@nestjs/common'
import { CreatePurchaseDto, PurchaseDto } from 'apps/cores'
import { ClientProxyService, InjectClientProxy } from 'common'
import { Messages } from 'shared'

@Injectable()
export class PurchaseProcessClient {
    constructor(@InjectClientProxy() private proxy: ClientProxyService) {}

    processPurchase(createDto: CreatePurchaseDto): Promise<PurchaseDto> {
        return this.proxy.getJson(Messages.PurchaseProcess.processPurchase, createDto)
    }
}
