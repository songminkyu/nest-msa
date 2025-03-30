import { Injectable } from '@nestjs/common'
import { StorageFileCreateDto } from 'apps/infrastructures'
import { ClientProxyService, InjectClientProxy } from 'common'
import { Messages } from 'shared'
import { MovieCreateDto, MovieDto, MovieQueryDto, MovieUpdateDto } from './dtos'

@Injectable()
export class MoviesClient {
    constructor(@InjectClientProxy() private proxy: ClientProxyService) {}

    createMovie(
        movieCreateDto: MovieCreateDto,
        fileCreateDtos: StorageFileCreateDto[]
    ): Promise<MovieDto> {
        return this.proxy.getJson(Messages.Movies.createMovie, { movieCreateDto, fileCreateDtos })
    }

    updateMovie(movieId: string, updateDto: MovieUpdateDto): Promise<MovieDto> {
        return this.proxy.getJson(Messages.Movies.updateMovie, { movieId, updateDto })
    }

    getMovies(movieIds: string[]): Promise<MovieDto[]> {
        return this.proxy.getJson(Messages.Movies.getMovies, movieIds)
    }

    deleteMovies(movieIds: string[]): Promise<boolean> {
        return this.proxy.getJson(Messages.Movies.deleteMovies, movieIds)
    }

    findMovies(queryDto: MovieQueryDto): Promise<MovieDto[]> {
        return this.proxy.getJson(Messages.Movies.findMovies, queryDto)
    }

    getMoviesByIds(movieIds: string[]): Promise<MovieDto[]> {
        return this.proxy.getJson(Messages.Movies.getMoviesByIds, movieIds)
    }

    moviesExist(movieIds: string[]): Promise<boolean> {
        return this.proxy.getJson(Messages.Movies.moviesExist, movieIds)
    }
}
