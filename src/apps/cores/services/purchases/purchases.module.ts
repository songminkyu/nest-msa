import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { PaymentsProxy } from 'apps/infrastructures'
import { MongooseConfig } from 'shared'
import { Purchase, PurchaseSchema } from './models'
import { PurchasesController } from './purchases.controller'
import { PurchasesRepository } from './purchases.repository'
import { PurchasesService } from './purchases.service'

@Module({
    imports: [
        MongooseModule.forFeature(
            [{ name: Purchase.name, schema: PurchaseSchema }],
            MongooseConfig.connName
        )
    ],
    providers: [PurchasesService, PurchasesRepository, PaymentsProxy],
    controllers: [PurchasesController]
})
export class PurchasesModule {}
