import { BadRequestException, NotFoundException, OnModuleInit } from '@nestjs/common'
import { differenceWith, uniq } from 'lodash'
import { ClientSession, HydratedDocument, Model, QueryWithHelpers } from 'mongoose'
import { CommonQueryDto, PaginationResult } from '../query'
import { Assert, Expect } from '../validator'
import { MongooseErrors } from './errors'
import { objectId, objectIds } from './mongoose.util'

export class DeleteResult {
    deletedCount: number
}

type SessionArg = ClientSession | undefined

export abstract class MongooseRepository<Doc> implements OnModuleInit {
    constructor(protected model: Model<Doc>) {}

    async onModuleInit() {
        /*
        Since document.save() internally calls createCollection(),
        calling save() at the same time can cause a "Collection namespace is already in use" error.
        This issue often occurs in unit test environments due to frequent re-initialization.

        document.save()가 내부적으로 createCollection()을 호출한다.
        동시에 save()를 호출하면 "Collection namespace is already in use" 오류가 발생할 수 있다.
        이 문제는 주로 단위 테스트 환경에서 빈번한 초기화로 인해 발생한다.

        https://mongoosejs.com/docs/api/model.html#Model.createCollection()
        */
        await this.model.createCollection()
        await this.model.createIndexes()
    }

    newDocument(): HydratedDocument<Doc> {
        return new this.model()
    }

    async saveMany(docs: HydratedDocument<Doc>[], session: SessionArg = undefined) {
        const { insertedCount, matchedCount, deletedCount } = await this.model.bulkSave(docs, {
            session
        })

        Assert.equals(
            docs.length,
            insertedCount + matchedCount + deletedCount,
            `The number of inserted documents should match the requested count`
        )

        return true
    }

    async findById(id: string, session: SessionArg = undefined) {
        return this.model.findById(objectId(id), null, { session })
    }

    async findByIds(ids: string[], session: SessionArg = undefined) {
        return this.model.find({ _id: { $in: objectIds(ids) } as any }, null, { session })
    }

    async getById(id: string, session: SessionArg = undefined) {
        const doc = await this.findById(id, session)

        if (!doc) {
            throw new NotFoundException({ ...MongooseErrors.DocumentNotFound, notFoundId: id })
        }

        return doc
    }

    async getByIds(ids: string[], session: SessionArg = undefined) {
        const uniqueIds = uniq(ids)

        Expect.equalLength(uniqueIds, ids, `Duplicate IDs detected and removed:${ids}`)

        const docs = await this.findByIds(uniqueIds, session)

        const notFoundIds = differenceWith(uniqueIds, docs, (id, doc) => id === doc.id)

        if (notFoundIds.length > 0) {
            throw new NotFoundException({
                ...MongooseErrors.MultipleDocumentsNotFound,
                notFoundIds: notFoundIds
            })
        }

        return docs
    }

    async deleteById(id: string, session: SessionArg = undefined) {
        const doc = await this.getById(id, session)
        await doc.deleteOne({ session })
    }

    async deleteByIds(ids: string[], session: SessionArg = undefined): Promise<DeleteResult> {
        await this.getByIds(ids)

        const result = await this.model.deleteMany(
            { _id: { $in: objectIds(ids) } as any },
            { session }
        )
        return result
    }

    async existByIds(ids: string[], session: SessionArg = undefined) {
        const count = await this.model.countDocuments({ _id: { $in: objectIds(ids) } } as any, {
            session
        })
        return count === ids.length
    }

    async findWithPagination(args: {
        configureQuery?: (queryHelper: QueryWithHelpers<Array<Doc>, Doc>) => void
        pagination: CommonQueryDto
        session?: SessionArg
    }) {
        const { configureQuery, pagination, session } = args

        const queryHelper = this.model.find({}, null, { session })

        let take = 0
        let skip = 0

        if (pagination.take) {
            take = pagination.take
            if (take <= 0) {
                throw new BadRequestException({ ...MongooseErrors.TakeInvalid, take })
            }
            queryHelper.limit(take)
        } else {
            throw new BadRequestException(MongooseErrors.TakeMissing)
        }

        if (pagination.skip) {
            skip = pagination.skip
            queryHelper.skip(skip)
        }

        if (pagination.orderby) {
            const { name, direction } = pagination.orderby
            queryHelper.sort({ [name]: direction })
        }

        if (configureQuery) {
            await configureQuery(queryHelper)
        }

        const items = await queryHelper.exec()
        const total = await this.model.countDocuments(queryHelper.getQuery()).exec()

        return { skip, take, total, items } as PaginationResult<HydratedDocument<Doc>>
    }

    async withTransaction<T>(
        callback: (session: ClientSession, rollback: () => void) => Promise<T>
    ) {
        let rollbackRequested = false
        const rollback = () => (rollbackRequested = true)

        let session: ClientSession | undefined

        try {
            session = await this.model.startSession()
            session.startTransaction()

            const result = await callback(session, rollback)

            return result
        } catch (error) {
            rollback()
            throw error
        } finally {
            /* istanbul ignore else */
            if (session) {
                /* istanbul ignore else */
                if (session.inTransaction()) {
                    if (rollbackRequested) {
                        await session.abortTransaction()
                    } else {
                        await session.commitTransaction()
                    }
                }

                await session.endSession()
            }
        }
    }
}
