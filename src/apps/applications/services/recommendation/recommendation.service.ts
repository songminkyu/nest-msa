import { Injectable } from '@nestjs/common'
import { OrderDirection } from 'common'
import { MovieDto, MoviesClient, ShowtimesClient, WatchRecordsClient } from 'apps/cores'
import { MovieRecommendationEngine } from './domain'

@Injectable()
export class RecommendationService {
    constructor(
        private showtimesService: ShowtimesClient,
        private moviesService: MoviesClient,
        private watchRecordsService: WatchRecordsClient
    ) {}

    async searchRecommendedMovies(customerId: string | null) {
        const showingMovieIds = await this.showtimesService.searchShowingMovieIds()

        const showingMovies = await this.moviesService.getMoviesByIds(showingMovieIds)
        let watchedMovies: MovieDto[] = []

        if (customerId) {
            const { items } = await this.watchRecordsService.searchWatchRecordsPage({
                customerId,
                take: 50,
                orderby: { name: 'watchDate', direction: OrderDirection.Desc }
            })
            const movieIds = items.map((record) => record.movieId)
            watchedMovies = await this.moviesService.getMoviesByIds(movieIds)
        }

        const recommendedMovies = MovieRecommendationEngine.recommend(showingMovies, watchedMovies)
        return recommendedMovies
    }
}
