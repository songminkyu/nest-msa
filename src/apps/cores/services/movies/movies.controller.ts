import { Controller } from '@nestjs/common'
import { MessagePattern, Payload } from '@nestjs/microservices'
import { Messages } from 'shared'
import { CreateMovieAndFilesDto, SearchMoviesDto, UpdateMovieDto } from './dtos'
import { MoviesService } from './movies.service'

@Controller()
export class MoviesController {
    constructor(private service: MoviesService) {}

    @MessagePattern(Messages.Movies.createMovie)
    createMovie(@Payload() { movieCreateDto, fileCreateDtos }: CreateMovieAndFilesDto) {
        return this.service.createMovie(movieCreateDto, fileCreateDtos)
    }

    @MessagePattern(Messages.Movies.updateMovie)
    updateMovie(
        @Payload('movieId') movieId: string,
        @Payload('updateDto') updateDto: UpdateMovieDto
    ) {
        return this.service.updateMovie(movieId, updateDto)
    }

    @MessagePattern(Messages.Movies.getMovies)
    getMovies(@Payload() movieIds: string[]) {
        return this.service.getMovies(movieIds)
    }

    @MessagePattern(Messages.Movies.deleteMovies)
    deleteMovies(@Payload() movieIds: string[]) {
        return this.service.deleteMovies(movieIds)
    }

    @MessagePattern(Messages.Movies.searchMoviesPage)
    searchMoviesPage(@Payload() searchDto: SearchMoviesDto) {
        return this.service.searchMoviesPage(searchDto)
    }

    @MessagePattern(Messages.Movies.getMoviesByIds)
    getMoviesByIds(@Payload() movieIds: string[]) {
        return this.service.getMoviesByIds(movieIds)
    }

    @MessagePattern(Messages.Movies.moviesExist)
    moviesExist(@Payload() movieIds: string[]) {
        return this.service.moviesExist(movieIds)
    }
}
