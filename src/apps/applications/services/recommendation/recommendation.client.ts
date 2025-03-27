import { Injectable } from '@nestjs/common'
import { MovieDto } from 'apps/cores'
import { ClientProxyService, InjectClientProxy } from 'common'
import { Messages } from 'shared'

@Injectable()
export class RecommendationClient {
    constructor(@InjectClientProxy() private proxy: ClientProxyService) {}

    findRecommendedMovies(customerId: string | null): Promise<MovieDto[]> {
        return this.proxy.getJson(Messages.Recommendation.findRecommendedMovies, customerId)
    }
}
