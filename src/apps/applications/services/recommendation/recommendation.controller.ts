import { Controller } from '@nestjs/common'
import { MessagePattern, Payload } from '@nestjs/microservices'
import { Messages } from 'shared'
import { RecommendationService } from './recommendation.service'

@Controller()
export class RecommendationController {
    constructor(private service: RecommendationService) {}

    @MessagePattern(Messages.Recommendation.searchRecommendedMovies)
    searchRecommendedMovies(@Payload() customerId: string | null) {
        return this.service.searchRecommendedMovies(customerId === '' ? null : customerId)
    }
}
