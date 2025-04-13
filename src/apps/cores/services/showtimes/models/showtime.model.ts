import { Prop, Schema } from '@nestjs/mongoose'
import { DateTimeRange, HardDelete, MongooseSchema, createMongooseSchema } from 'common'
import { HydratedDocument, Types } from 'mongoose'
import { MongooseConfig } from 'shared'

@HardDelete()
@Schema(MongooseConfig.schemaOptions)
export class Showtime extends MongooseSchema {
    @Prop({ required: true })
    batchId: Types.ObjectId

    @Prop({ required: true })
    theaterId: Types.ObjectId

    @Prop({ required: true })
    movieId: Types.ObjectId

    @Prop({ type: Object, required: true })
    timeRange: DateTimeRange
}
export type ShowtimeDocument = HydratedDocument<Showtime>
export const ShowtimeSchema = createMongooseSchema(Showtime)
