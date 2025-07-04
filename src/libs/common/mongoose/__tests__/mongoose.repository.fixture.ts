import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel, MongooseModule, Prop, Schema } from '@nestjs/mongoose'
import {
    createMongooseSchema,
    mapDocToDto,
    MongooseRepository,
    MongooseSchema,
    padNumber
} from 'common'
import { HydratedDocument, Model } from 'mongoose'
import { createTestContext, getMongoTestConnection, withTestId } from 'testlib'

@Schema({ toJSON: { virtuals: true } })
class Sample extends MongooseSchema {
    @Prop({ required: true })
    name: string
}
type SampleDocument = HydratedDocument<Sample>
const SampleSchema = createMongooseSchema(Sample)

export class SampleDto {
    id: string
    name: string
}

@Injectable()
class SamplesRepository extends MongooseRepository<Sample> {
    constructor(@InjectModel(Sample.name) model: Model<Sample>) {
        super(model)
    }
}

export const sortByName = (documents: SampleDto[]) =>
    documents.sort((a, b) => a.name.localeCompare(b.name))

export const sortByNameDescending = (documents: SampleDto[]) =>
    documents.sort((a, b) => b.name.localeCompare(a.name))

export const createSample = (repository: SamplesRepository) => {
    const doc = repository.newDocument()
    doc.name = 'Sample-Name'
    return doc.save()
}

export const createSamples = async (repository: SamplesRepository) =>
    Promise.all(
        Array.from({ length: 20 }, async (_, index) => {
            const doc = repository.newDocument()
            doc.name = `Sample-${padNumber(index, 3)}`
            return doc.save()
        })
    )

export const toDto = (item: SampleDocument) => mapDocToDto(item, SampleDto, ['id', 'name'])
export const toDtos = (items: SampleDocument[]) => items.map((item) => toDto(item))

export interface Fixture {
    teardown: () => Promise<void>
    repository: SamplesRepository
    BadRequestException: typeof BadRequestException
    NotFoundException: typeof NotFoundException
}

export async function createFixture() {
    const { uri } = getMongoTestConnection()

    const testContext = await createTestContext({
        metadata: {
            imports: [
                MongooseModule.forRootAsync({
                    useFactory: () => ({ uri, dbName: withTestId('mongoose-repository') })
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

    return { teardown, repository, BadRequestException, NotFoundException }
}
