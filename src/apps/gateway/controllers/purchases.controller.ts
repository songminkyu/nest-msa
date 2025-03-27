import { Body, Controller, Get, Param, Post } from '@nestjs/common'
import { PurchaseProcessProxy } from 'apps/applications'
import { PurchaseCreateDto, PurchasesProxy } from 'apps/cores'

@Controller('purchases')
export class PurchasesController {
    constructor(
        private purchasesService: PurchasesProxy,
        private purchaseProcessService: PurchaseProcessProxy
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
