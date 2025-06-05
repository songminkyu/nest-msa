import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { MongooseRepository, objectId, QueryBuilder, QueryBuilderOptions } from 'common'
import { Model } from 'mongoose'
import { CreateWatchRecordDto, SearchWatchRecordsDto } from './dtos'
import { WatchRecord } from './models'

@Injectable()
export class WatchRecordsRepository extends MongooseRepository<WatchRecord> {
    constructor(@InjectModel(WatchRecord.name) model: Model<WatchRecord>) {
        super(model)
    }

    async createWatchRecord(createDto: CreateWatchRecordDto) {
        const watchRecord = this.newDocument()
        watchRecord.customerId = objectId(createDto.customerId)
        watchRecord.movieId = objectId(createDto.movieId)
        watchRecord.purchaseId = objectId(createDto.purchaseId)
        watchRecord.watchDate = createDto.watchDate

        return watchRecord.save()
    }

    async searchWatchRecordsPage(queryDto: SearchWatchRecordsDto) {
        const { take, skip, orderby } = queryDto

        const paginated = await this.findWithPagination({
            callback: (helpers) => {
                const query = this.buildQuery(queryDto, { allowEmpty: true })

                helpers.setQuery(query)
            },
            pagination: { take, skip, orderby }
        })

        return paginated
    }

    private buildQuery(queryDto: SearchWatchRecordsDto, options: QueryBuilderOptions) {
        const { customerId } = queryDto

        const builder = new QueryBuilder<WatchRecord>()
        builder.addId('customerId', customerId)

        const query = builder.build(options)
        return query
    }
}
