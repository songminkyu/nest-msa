import { BullModule } from '@nestjs/bullmq'
import { Module } from '@nestjs/common'
import { MoviesServiceProxy, ShowtimesProxy, TheatersProxy, TicketsProxy } from 'apps/cores'
import { ShowtimeCreationValidatorService, ShowtimeCreationWorkerService } from './services'
import { ShowtimeCreationController } from './showtime-creation.controller'
import { ShowtimeCreationService } from './showtime-creation.service'

@Module({
    imports: [BullModule.registerQueue({ configKey: 'queue', name: 'showtime-creation' })],
    providers: [
        MoviesServiceProxy,
        TheatersProxy,
        ShowtimesProxy,
        TicketsProxy,
        ShowtimeCreationService,
        ShowtimeCreationWorkerService,
        ShowtimeCreationValidatorService
    ],
    controllers: [ShowtimeCreationController]
})
export class ShowtimeCreationModule {}
