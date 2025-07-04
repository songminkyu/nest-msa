import { Injectable } from '@nestjs/common'
import { InjectModel, MongooseModule, Prop, Schema } from '@nestjs/mongoose'
import { createMongooseSchema, MongooseRepository, MongooseSchema } from 'common'
import { Model } from 'mongoose'
import { createTestContext, getMongoTestConnection, withTestId } from 'testlib'

@Schema()
class Sample extends MongooseSchema {
    @Prop({ required: true })
    name: string
}

const SampleSchema = createMongooseSchema(Sample)

@Injectable()
class SamplesRepository extends MongooseRepository<Sample> {
    constructor(@InjectModel(Sample.name) model: Model<Sample>) {
        super(model)
    }
}

export interface Fixture {
    teardown: () => Promise<void>
    repository: SamplesRepository
}

export async function createFixture() {
    const { uri } = getMongoTestConnection()

    const testContext = await createTestContext({
        metadata: {
            imports: [
                MongooseModule.forRootAsync({
                    useFactory: () => ({ uri, dbName: withTestId('mongoose-transaction') })
                }),
                MongooseModule.forFeature([{ name: Sample.name, schema: SampleSchema }])
            ],
            providers: [SamplesRepository]
        }
    })

    const repository = testContext.module.get(SamplesRepository)

    const teardown = async () => {
        await testContext?.close()
    }

    return { teardown, repository }
}
