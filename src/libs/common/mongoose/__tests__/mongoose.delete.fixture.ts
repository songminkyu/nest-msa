import { Type } from '@nestjs/common'
import { getModelToken, MongooseModule, Prop, Schema } from '@nestjs/mongoose'
import { createMongooseSchema, HardDelete, MongooseSchema } from 'common'
import { HydratedDocument, Model } from 'mongoose'
import { createTestContext, getMongoTestConnection, withTestId } from 'testlib'

@HardDelete()
@Schema()
export class HardDeleteSample extends MongooseSchema {
    @Prop()
    name: string
}

@Schema()
export class SoftDeleteSample extends MongooseSchema {
    @Prop()
    name: string
}

export interface Fixture<T> {
    teardown: () => Promise<void>
    model: Model<T>
    doc: HydratedDocument<T>
}

export async function createFixture<T>(cls: Type<T>) {
    const schema = createMongooseSchema(cls)

    const { uri } = getMongoTestConnection()

    const testContext = await createTestContext({
        metadata: {
            imports: [
                MongooseModule.forRootAsync({
                    useFactory: () => ({ uri, dbName: withTestId('mongoose-delete') })
                }),
                MongooseModule.forFeature([{ name: 'schema', schema }])
            ]
        }
    })

    const model = testContext.module.get<Model<HardDeleteSample | SoftDeleteSample>>(
        getModelToken('schema')
    )

    const doc = new model()
    doc.name = 'name'
    await doc.save()

    const teardown = async () => {
        await testContext?.close()
    }

    return { teardown, model, doc }
}
