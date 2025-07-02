import { MovieDto, MovieGenre, MovieRating } from 'apps/cores'
import { MovieRecommendationEngine } from '..'

describe('MovieRecommendationEngine', () => {
    describe('generateRecommendedMovies', () => {
        const createDto = (id: string, genres: MovieGenre[], releaseDate: Date) => ({
            id,
            title: `MovieTitle#${id}`,
            genres,
            releaseDate,
            plot: '.',
            durationInSeconds: 0,
            director: '.',
            rating: MovieRating.PG,
            images: []
        })

        /* 사용자의 관람 이력이 없을 때, 개봉일 최신 순으로 정렬한다 */
        it('Should sort by the latest release date if the user has no watch history', () => {
            const showingMovies: MovieDto[] = [
                createDto('1', [MovieGenre.Action], new Date('2023-09-01')),
                createDto('2', [MovieGenre.Drama], new Date('2023-10-01')),
                createDto('3', [MovieGenre.Comedy], new Date('2023-08-01'))
            ]
            const watchedMovies: MovieDto[] = []

            const result = MovieRecommendationEngine.recommend(showingMovies, watchedMovies)

            expect(result.map((movie) => movie.id)).toEqual(['2', '1', '3'])
        })

        /* 사용자의 선호 장르에 따라 영화가 추천된다 */
        it('Should recommend movies based on the user’s preferred genres', () => {
            const showingMovies: MovieDto[] = [
                createDto('1', [MovieGenre.Action], new Date('2023-09-01')),
                createDto('2', [MovieGenre.Drama], new Date('2023-10-01')),
                createDto('3', [MovieGenre.Comedy], new Date('2023-08-01'))
            ]
            const watchedMovies: MovieDto[] = [
                createDto('4', [MovieGenre.Action], new Date('2023-07-01')),
                createDto('5', [MovieGenre.Action], new Date('2023-06-01')),
                createDto('6', [MovieGenre.Drama], new Date('2023-05-01'))
            ]

            const result = MovieRecommendationEngine.recommend(showingMovies, watchedMovies)

            expect(result.map((movie) => movie.id)).toEqual(['1', '2', '3'])
        })

        /* 이미 본 영화는 추천 목록에서 제외된다 */
        it('Should exclude movies that the user has already watched from the recommendation list', () => {
            const showingMovies: MovieDto[] = [
                createDto('1', [MovieGenre.Action], new Date('2023-09-01')),
                createDto('2', [MovieGenre.Drama], new Date('2023-10-01')),
                createDto('3', [MovieGenre.Comedy], new Date('2023-08-01'))
            ]
            const watchedMovies: MovieDto[] = [
                createDto('2', [MovieGenre.Drama], new Date('2023-10-01'))
            ]

            const result = MovieRecommendationEngine.recommend(showingMovies, watchedMovies)

            expect(result.map((movie) => movie.id)).toEqual(['1', '3'])
        })
    })
})
