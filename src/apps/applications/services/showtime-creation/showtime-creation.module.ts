import { BullModule } from '@nestjs/bullmq'
import { Module } from '@nestjs/common'
import { MoviesClient, ShowtimesClient, TheatersClient, TicketsClient } from 'apps/cores'
import { ShowtimeCreationValidatorService, ShowtimeCreationWorkerService } from './services'
import { ShowtimeCreationClient } from './showtime-creation.client'
import { ShowtimeCreationController } from './showtime-creation.controller'
import { ShowtimeCreationService } from './showtime-creation.service'

@Module({
    imports: [BullModule.registerQueue({ configKey: 'queue', name: 'showtime-creation' })],
    providers: [
        MoviesClient,
        TheatersClient,
        ShowtimesClient,
        TicketsClient,
        ShowtimeCreationClient,
        ShowtimeCreationService,
        ShowtimeCreationWorkerService,
        ShowtimeCreationValidatorService
    ],
    controllers: [ShowtimeCreationController]
})
export class ShowtimeCreationModule {}
