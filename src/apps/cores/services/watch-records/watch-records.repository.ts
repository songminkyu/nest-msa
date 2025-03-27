import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { MongooseRepository, objectId, QueryBuilder } from 'common'
import { Model } from 'mongoose'
import { WatchRecordCreateDto, WatchRecordQueryDto } from './dtos'
import { WatchRecord } from './models'

@Injectable()
export class WatchRecordsRepository extends MongooseRepository<WatchRecord> {
    constructor(@InjectModel(WatchRecord.name) model: Model<WatchRecord>) {
        super(model)
    }

    async createWatchRecord(createDto: WatchRecordCreateDto) {
        const watchRecord = this.newDocument()
        watchRecord.customerId = objectId(createDto.customerId)
        watchRecord.movieId = objectId(createDto.movieId)
        watchRecord.purchaseId = objectId(createDto.purchaseId)
        watchRecord.watchDate = createDto.watchDate

        return watchRecord.save()
    }

    async findWatchRecords(queryDto: WatchRecordQueryDto) {
        const { customerId, ...pagination } = queryDto

        const paginated = await this.findWithPagination({
            callback: (helpers) => {
                const builder = new QueryBuilder<WatchRecord>()
                builder.addId('customerId', customerId)

                const query = builder.build({})

                helpers.setQuery(query)
            },
            pagination
        })

        return paginated
    }
}
