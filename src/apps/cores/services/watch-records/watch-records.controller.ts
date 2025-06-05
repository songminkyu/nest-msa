import { Controller } from '@nestjs/common'
import { MessagePattern, Payload } from '@nestjs/microservices'
import { Messages } from 'shared'
import { CreateWatchRecordDto, SearchWatchRecordsDto } from './dtos'
import { WatchRecordsService } from './watch-records.service'

@Controller()
export class WatchRecordsController {
    constructor(private service: WatchRecordsService) {}

    @MessagePattern(Messages.WatchRecords.createWatchRecord)
    createWatchRecord(@Payload() createDto: CreateWatchRecordDto) {
        return this.service.createWatchRecord(createDto)
    }

    @MessagePattern(Messages.WatchRecords.searchWatchRecordsPage)
    searchWatchRecordsPage(@Payload() searchDto: SearchWatchRecordsDto) {
        return this.service.searchWatchRecordsPage(searchDto)
    }
}
