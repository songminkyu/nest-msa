import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { MongooseRepository, objectId } from 'common'
import { Model } from 'mongoose'
import { MongooseConfigModule } from 'shared'
import { CreatePaymentDto } from './dtos'
import { Payment } from './models'

@Injectable()
export class PaymentsRepository extends MongooseRepository<Payment> {
    constructor(
        @InjectModel(Payment.name, MongooseConfigModule.connectionName) model: Model<Payment>
    ) {
        super(model)
    }

    async createPayment(createDto: CreatePaymentDto) {
        const payment = this.newDocument()
        payment.customerId = objectId(createDto.customerId)
        payment.amount = createDto.amount
        await payment.save()

        return payment
    }
}
