import { Injectable } from '@nestjs/common'
import { MovieDto } from 'apps/cores'
import { ClientProxyService, InjectClientProxy } from 'common'
import { ClientProxyConfig, Messages } from 'shared'

@Injectable()
export class RecommendationProxy {
    constructor(
        @InjectClientProxy(ClientProxyConfig.connName) private service: ClientProxyService
    ) {}

    findRecommendedMovies(customerId: string | null): Promise<MovieDto[]> {
        return this.service.getJson(Messages.Recommendation.findRecommendedMovies, customerId)
    }
}
