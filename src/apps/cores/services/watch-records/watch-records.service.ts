import { Injectable } from '@nestjs/common'
import { mapDocToDto } from 'common'
import { CreateWatchRecordDto, WatchRecordDto, SearchWatchRecordsDto } from './dtos'
import { WatchRecordDocument } from './models'
import { WatchRecordsRepository } from './watch-records.repository'

@Injectable()
export class WatchRecordsService {
    constructor(private repository: WatchRecordsRepository) {}

    async createWatchRecord(createDto: CreateWatchRecordDto) {
        const watchRecord = await this.repository.createWatchRecord(createDto)

        return this.toDto(watchRecord)
    }

    async searchWatchRecordsPage(queryDto: SearchWatchRecordsDto) {
        const { items, ...paginated } = await this.repository.searchWatchRecordsPage(queryDto)

        return { ...paginated, items: this.toDtos(items) }
    }

    private toDto = (watchRecord: WatchRecordDocument) =>
        mapDocToDto(watchRecord, WatchRecordDto, [
            'id',
            'customerId',
            'movieId',
            'purchaseId',
            'watchDate'
        ])

    private toDtos = (watchRecords: WatchRecordDocument[]) =>
        watchRecords.map((watchRecord) => this.toDto(watchRecord))
}
