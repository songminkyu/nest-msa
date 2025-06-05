import { Controller } from '@nestjs/common'
import { MessagePattern, Payload } from '@nestjs/microservices'
import { CreatePurchaseDto } from 'apps/cores'
import { Messages } from 'shared'
import { PurchaseProcessService } from './purchase-process.service'

@Controller()
export class PurchaseProcessController {
    constructor(private service: PurchaseProcessService) {}

    @MessagePattern(Messages.PurchaseProcess.processPurchase)
    processPurchase(@Payload() createDto: CreatePurchaseDto) {
        return this.service.processPurchase(createDto)
    }
}
