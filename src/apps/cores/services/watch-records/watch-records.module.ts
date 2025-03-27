import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { WatchRecord, WatchRecordSchema } from './models'
import { WatchRecordsController } from './watch-records.controller'
import { WatchRecordsRepository } from './watch-records.repository'
import { WatchRecordsService } from './watch-records.service'

@Module({
    imports: [MongooseModule.forFeature([{ name: WatchRecord.name, schema: WatchRecordSchema }])],
    providers: [WatchRecordsService, WatchRecordsRepository],
    controllers: [WatchRecordsController]
})
export class WatchRecordsModule {}
