import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { PaymentsClient } from 'apps/infrastructures'
import { Purchase, PurchaseSchema } from './models'
import { PurchasesController } from './purchases.controller'
import { PurchasesRepository } from './purchases.repository'
import { PurchasesService } from './purchases.service'

@Module({
    imports: [MongooseModule.forFeature([{ name: Purchase.name, schema: PurchaseSchema }])],
    providers: [PurchasesService, PurchasesRepository, PaymentsClient],
    controllers: [PurchasesController]
})
export class PurchasesModule {}
