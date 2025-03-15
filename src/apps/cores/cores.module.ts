import { Module } from '@nestjs/common'
import { CommonModule, MongooseConfigModule, RedisConfigModule } from 'shared'
import { HealthModule, PipesModule } from './modules'
import {
    CustomersModule,
    MoviesModule,
    PurchasesModule,
    ShowtimesModule,
    TheatersModule,
    TicketHoldingModule,
    TicketsModule,
    WatchRecordsModule
} from './services'

@Module({
    imports: [
        CommonModule,
        RedisConfigModule,
        MongooseConfigModule,
        HealthModule,
        CustomersModule,
        MoviesModule,
        TheatersModule,
        ShowtimesModule,
        TicketsModule,
        TicketHoldingModule,
        WatchRecordsModule,
        PurchasesModule,
        PipesModule
    ]
})
export class CoresModule {}
