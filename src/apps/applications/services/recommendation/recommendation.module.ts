import { Module } from '@nestjs/common'
import { MoviesClient, ShowtimesClient, WatchRecordsClient } from 'apps/cores'
import { RecommendationController } from './recommendation.controller'
import { RecommendationService } from './recommendation.service'

@Module({
    providers: [RecommendationService, ShowtimesClient, MoviesClient, WatchRecordsClient],
    controllers: [RecommendationController]
})
export class RecommendationModule {}
