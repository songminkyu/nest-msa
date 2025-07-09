import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { MongooseRepository, objectId, QueryBuilder, QueryBuilderOptions } from 'common'
import { Model } from 'mongoose'
import { MongooseConfigModule } from 'shared'
import { CreateWatchRecordDto, SearchWatchRecordsDto } from './dtos'
import { WatchRecord } from './models'

@Injectable()
export class WatchRecordsRepository extends MongooseRepository<WatchRecord> {
    constructor(
        @InjectModel(WatchRecord.name, MongooseConfigModule.connectionName)
        model: Model<WatchRecord>
    ) {
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

    async searchWatchRecordsPage(searchDto: SearchWatchRecordsDto) {
        const { take, skip, orderby } = searchDto

        const paginated = await this.findWithPagination({
            configureQuery: (queryHelper) => {
                const query = this.buildQuery(searchDto, { allowEmpty: true })

                queryHelper.setQuery(query)
            },
            pagination: { take, skip, orderby }
        })

        return paginated
    }

    private buildQuery(searchDto: SearchWatchRecordsDto, options: QueryBuilderOptions) {
        const { customerId } = searchDto

        const builder = new QueryBuilder<WatchRecord>()
        builder.addId('customerId', customerId)

        const query = builder.build(options)
        return query
    }
}
