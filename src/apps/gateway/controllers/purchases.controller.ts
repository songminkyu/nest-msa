import { Body, Controller, Get, Param, Post } from '@nestjs/common'
import { PurchaseProcessServiceProxy } from 'apps/applications'
import { PurchaseCreateDto, PurchasesServiceProxy } from 'apps/cores'

@Controller('purchases')
export class PurchasesController {
    constructor(
        private purchasesService: PurchasesServiceProxy,
        private purchaseProcessService: PurchaseProcessServiceProxy
    ) {}

    @Post()
    async processPurchase(@Body() createDto: PurchaseCreateDto) {
        return this.purchaseProcessService.processPurchase(createDto)
    }

    @Get(':purchseId')
    async getPurchase(@Param('purchseId') purchseId: string) {
        return this.purchasesService.getPurchase(purchseId)
    }
}
