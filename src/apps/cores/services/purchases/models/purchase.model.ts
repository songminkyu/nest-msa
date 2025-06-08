import { Prop, Schema } from '@nestjs/mongoose'
import { IsEnum, IsNotEmpty, IsString } from 'class-validator'
import { MongooseSchema, createMongooseSchema } from 'common'
import { HydratedDocument, Types } from 'mongoose'
import { MongooseConfig } from 'shared'

export enum PurchaseItemType {
    Ticket = 'ticket'
}

export class PurchaseItem {
    @IsEnum(PurchaseItemType)
    type: PurchaseItemType

    @IsString()
    @IsNotEmpty()
    ticketId: Types.ObjectId
}

@Schema(MongooseConfig.schemaOptions)
export class Purchase extends MongooseSchema {
    @Prop({ required: true })
    customerId: Types.ObjectId

    @Prop({ default: null })
    paymentId: Types.ObjectId

    @Prop({ required: true })
    totalPrice: number

    @Prop({ type: [Object], required: true })
    purchaseItems: PurchaseItem[]
}
export type PurchaseDocument = HydratedDocument<Purchase>
export const PurchaseSchema = createMongooseSchema(Purchase)
