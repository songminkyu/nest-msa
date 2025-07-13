import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { MongooseRepository, objectId } from 'common'
import { Model } from 'mongoose'
import { MongooseConfigModule } from 'shared'
import { CreatePurchaseDto } from './dtos'
import { Purchase } from './models'

@Injectable()
export class PurchasesRepository extends MongooseRepository<Purchase> {
    constructor(
        @InjectModel(Purchase.name, MongooseConfigModule.connectionName) model: Model<Purchase>
    ) {
        super(model, MongooseConfigModule.maxTake)
    }

    async createPurchase(createDto: CreatePurchaseDto & { paymentId: string }) {
        const purchase = this.newDocument()
        purchase.customerId = objectId(createDto.customerId)
        purchase.paymentId = objectId(createDto.paymentId)
        purchase.totalPrice = createDto.totalPrice
        purchase.purchaseItems = createDto.purchaseItems.map((item) => ({
            ...item,
            ticketId: objectId(item.ticketId)
        }))

        await purchase.save()

        return purchase
    }
}
