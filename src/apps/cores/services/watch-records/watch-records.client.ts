import { Injectable } from '@nestjs/common'
import { ClientProxyService, InjectClientProxy, PaginationResult } from 'common'
import { Messages } from 'shared'
import { WatchRecordDto, WatchRecordQueryDto } from './dtos'

@Injectable()
export class WatchRecordsClient {
    constructor(@InjectClientProxy() private proxy: ClientProxyService) {}

    findWatchRecords(queryDto: WatchRecordQueryDto): Promise<PaginationResult<WatchRecordDto>> {
        return this.proxy.getJson(Messages.WatchRecords.findWatchRecords, queryDto)
    }
}
