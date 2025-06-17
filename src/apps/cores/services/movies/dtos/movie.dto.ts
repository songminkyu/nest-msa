import { MovieGenre, MovieRating } from '../models'

export class MovieDto {
    id: string
    title: string
    genres: MovieGenre[]
    releaseDate: Date
    plot: string
    durationSeconds: number
    director: string
    rating: MovieRating
    images: string[]
}
