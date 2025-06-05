import { Injectable } from '@nestjs/common'
import { ClientProxyService, InjectClientProxy, PaginationResult } from 'common'
import { Messages } from 'shared'
import { CreateWatchRecordDto, WatchRecordDto, SearchWatchRecordsDto } from './dtos'

@Injectable()
export class WatchRecordsClient {
    constructor(@InjectClientProxy() private proxy: ClientProxyService) {}

    createWatchRecord(createDto: CreateWatchRecordDto): Promise<WatchRecordDto> {
        return this.proxy.getJson(Messages.WatchRecords.createWatchRecord, createDto)
    }

    searchWatchRecordsPage(
        queryDto: SearchWatchRecordsDto
    ): Promise<PaginationResult<WatchRecordDto>> {
        return this.proxy.getJson(Messages.WatchRecords.searchWatchRecordsPage, queryDto)
    }
}
