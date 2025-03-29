import { Prop, Schema } from '@nestjs/mongoose'
import { MongooseSchema, createMongooseSchema } from 'common'
import { HydratedDocument } from 'mongoose'
import { MongooseConfig } from 'shared'

@Schema(MongooseConfig.schemaOptions)
export class Customer extends MongooseSchema {
    @Prop({ required: true })
    name: string

    @Prop({ unique: true, required: true })
    email: string

    @Prop({ required: true })
    birthdate: Date

    @Prop({ required: true, select: false })
    password: string
}
export type CustomerDocument = HydratedDocument<Customer>
export const CustomerSchema = createMongooseSchema(Customer)

/* `name` 필드에 대해 텍스트 인덱스를 생성해서 고객 이름에 대한 검색을 가능하게 합니다. */
CustomerSchema.index({ name: 'text' })
