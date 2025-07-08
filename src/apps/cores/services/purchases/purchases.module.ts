import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { PaymentsClient } from 'apps/infrastructures'
import { MongooseConfigModule } from 'shared'
import { Purchase, PurchaseSchema } from './models'
import { PurchasesController } from './purchases.controller'
import { PurchasesRepository } from './purchases.repository'
import { PurchasesService } from './purchases.service'

@Module({
    imports: [
        MongooseModule.forFeature(
            [{ name: Purchase.name, schema: PurchaseSchema }],
            MongooseConfigModule.connectionName
        )
    ],
    providers: [PurchasesService, PurchasesRepository, PaymentsClient],
    controllers: [PurchasesController]
})
export class PurchasesModule {}
