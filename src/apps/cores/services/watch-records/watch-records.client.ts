import { Injectable } from '@nestjs/common'
import { ClientProxyService, InjectClientProxy, PaginationResult } from 'common'
import { Messages } from 'shared'
import { WatchRecordCreateDto, WatchRecordDto, WatchRecordQueryDto } from './dtos'

@Injectable()
export class WatchRecordsClient {
    constructor(@InjectClientProxy() private proxy: ClientProxyService) {}

    createWatchRecord(createDto: WatchRecordCreateDto): Promise<WatchRecordDto> {
        return this.proxy.getJson(Messages.WatchRecords.createWatchRecord, createDto)
    }

    findWatchRecords(queryDto: WatchRecordQueryDto): Promise<PaginationResult<WatchRecordDto>> {
        return this.proxy.getJson(Messages.WatchRecords.findWatchRecords, queryDto)
    }
}
