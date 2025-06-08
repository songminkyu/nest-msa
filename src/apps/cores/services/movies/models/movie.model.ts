import { Prop, Schema } from '@nestjs/mongoose'
import { MongooseSchema, createMongooseSchema } from 'common'
import { HydratedDocument, Types } from 'mongoose'
import { MongooseConfig } from 'shared'

export enum MovieGenre {
    Action = 'action',
    Comedy = 'comedy',
    Drama = 'drama',
    Fantasy = 'fantasy',
    Horror = 'horror',
    Mystery = 'mystery',
    Romance = 'romance',
    Thriller = 'thriller',
    Western = 'western'
}

export enum MovieRating {
    G = 'G',
    PG = 'PG',
    PG13 = 'PG13',
    R = 'R',
    NC17 = 'NC17'
}

@Schema(MongooseConfig.schemaOptions)
export class Movie extends MongooseSchema {
    @Prop({ required: true })
    title: string

    @Prop({ type: [String], enum: MovieGenre, default: [] })
    genre: MovieGenre[]

    @Prop({ required: true })
    releaseDate: Date

    @Prop({ default: '' })
    plot: string

    @Prop({ required: true })
    durationMinutes: number

    @Prop({ default: 'John Doe' })
    director: string

    @Prop({ type: String, enum: MovieRating })
    rating: MovieRating

    @Prop({ required: true })
    imageFileIds: Types.ObjectId[]
}
export type MovieDocument = HydratedDocument<Movie>
export const MovieSchema = createMongooseSchema(Movie)
