import { Injectable } from '@nestjs/common'
import { StorageFileCreateDto } from 'apps/infrastructures'
import { ClientProxyService, InjectClientProxy } from 'common'
import { Messages } from 'shared'
import { CreateMovieDto, MovieDto, SearchMoviesDto, UpdateMovieDto } from './dtos'

@Injectable()
export class MoviesClient {
    constructor(@InjectClientProxy() private proxy: ClientProxyService) {}

    createMovie(
        movieCreateDto: CreateMovieDto,
        fileCreateDtos: StorageFileCreateDto[]
    ): Promise<MovieDto> {
        return this.proxy.getJson(Messages.Movies.createMovie, { movieCreateDto, fileCreateDtos })
    }

    updateMovie(movieId: string, updateDto: UpdateMovieDto): Promise<MovieDto> {
        return this.proxy.getJson(Messages.Movies.updateMovie, { movieId, updateDto })
    }

    getMovies(movieIds: string[]): Promise<MovieDto[]> {
        return this.proxy.getJson(Messages.Movies.getMovies, movieIds)
    }

    deleteMovies(movieIds: string[]): Promise<boolean> {
        return this.proxy.getJson(Messages.Movies.deleteMovies, movieIds)
    }

    searchMoviesPage(searchDto: SearchMoviesDto): Promise<MovieDto[]> {
        return this.proxy.getJson(Messages.Movies.searchMoviesPage, searchDto)
    }

    getMoviesByIds(movieIds: string[]): Promise<MovieDto[]> {
        return this.proxy.getJson(Messages.Movies.getMoviesByIds, movieIds)
    }

    moviesExist(movieIds: string[]): Promise<boolean> {
        return this.proxy.getJson(Messages.Movies.moviesExist, movieIds)
    }
}
