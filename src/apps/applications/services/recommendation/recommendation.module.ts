import { Module } from '@nestjs/common'
import { MoviesServiceProxy, ShowtimesProxy, WatchRecordsProxy } from 'apps/cores'
import { RecommendationController } from './recommendation.controller'
import { RecommendationService } from './recommendation.service'

@Module({
    providers: [RecommendationService, ShowtimesProxy, MoviesServiceProxy, WatchRecordsProxy],
    controllers: [RecommendationController]
})
export class RecommendationModule {}
