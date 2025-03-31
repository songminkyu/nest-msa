import { Prop, Schema } from '@nestjs/mongoose'
import { LatLong, MongooseSchema, createMongooseSchema } from 'common'
import { HydratedDocument } from 'mongoose'
import { MongooseConfig } from 'shared'
import { Seatmap } from './seatmap'

@Schema(MongooseConfig.schemaOptions)
export class Theater extends MongooseSchema {
    @Prop({ required: true })
    name: string

    @Prop({
        type: {
            latitude: { type: Number, required: true },
            longitude: { type: Number, required: true }
        },
        required: true,
        _id: false
    })
    latlong: LatLong

    @Prop({ type: Object, required: true })
    seatmap: Seatmap
}
export type TheaterDocument = HydratedDocument<Theater>
export const TheaterSchema = createMongooseSchema(Theater)

/* `name` 필드에 대해 텍스트 인덱스를 생성해서 고객 이름에 대한 검색을 가능하게 합니다. */
TheaterSchema.index({ name: 'text' })
