import { Path } from 'common'
import { SchemaOptions } from 'mongoose'

export const ProjectName = 'nest-seed'

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

export const TestFiles = {
    image: { path: Path.join('./test/fixtures', 'image.png'), size: 854634 },
    smallText: { path: Path.join('./test/fixtures', 'text.txt'), size: 976 }
}
