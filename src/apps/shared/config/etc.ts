import { SchemaOptions } from 'mongoose'

export const ProjectName = 'nest-msa'

export class MongooseConfig {
    static schemaOptions: SchemaOptions = {
        // https://mongoosejs.com/docs/guide.html#optimisticConcurrency
        optimisticConcurrency: true,
        minimize: false,
        strict: 'throw',
        strictQuery: 'throw',
        timestamps: true,
        validateBeforeSave: true,
        toJSON: { virtuals: true, flattenObjectIds: true, versionKey: false }
    }
}
