import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { MongooseConfigModule } from 'shared'
import { Payment, PaymentSchema } from './models'
import { PaymentsController } from './payments.controller'
import { PaymentsRepository } from './payments.repository'
import { PaymentsService } from './payments.service'

@Module({
    imports: [
        MongooseModule.forFeature(
            [{ name: Payment.name, schema: PaymentSchema }],
            MongooseConfigModule.connectionName
        )
    ],
    providers: [PaymentsService, PaymentsRepository],
    controllers: [PaymentsController]
})
export class PaymentsModule {}
