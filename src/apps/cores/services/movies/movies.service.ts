import { Injectable } from '@nestjs/common'
import { mapDocToDto, pickIds } from 'common'
import { StorageFileCreateDto, StorageFilesClient } from 'apps/infrastructures'
import { Routes } from 'shared'
import { CreateMovieDto, MovieDto, SearchMoviesDto, UpdateMovieDto } from './dtos'
import { MovieDocument } from './models'
import { MoviesRepository } from './movies.repository'

@Injectable()
export class MoviesService {
    constructor(
        private repository: MoviesRepository,
        private storageFilesService: StorageFilesClient
    ) {}

    async createMovie(movieCreateDto: CreateMovieDto, fileCreateDtos: StorageFileCreateDto[]) {
        const storageFiles = await this.storageFilesService.saveFiles(fileCreateDtos)

        const movie = await this.repository.createMovie(movieCreateDto, pickIds(storageFiles))
        return this.toDto(movie)
    }

    async updateMovie(movieId: string, updateDto: UpdateMovieDto) {
        const movie = await this.repository.updateMovie(movieId, updateDto)
        return this.toDto(movie)
    }

    async getMovies(movieIds: string[]) {
        const movies = await this.repository.getByIds(movieIds)
        return this.toDtos(movies)
    }

    async deleteMovies(movieIds: string[]) {
        const success = await this.repository.withTransaction(async (session) => {
            const movies = await this.repository.getByIds(movieIds)

            for (const movie of movies) {
                await movie.deleteOne({ session })

                const fileIds = movie.imageIds.map((id) => id.toString())
                await this.storageFilesService.deleteFiles(fileIds)
            }

            return true
        })

        return success
    }

    async searchMoviesPage(searchDto: SearchMoviesDto) {
        const { items, ...paginated } = await this.repository.searchMoviesPage(searchDto)

        return { ...paginated, items: this.toDtos(items) }
    }

    async getMoviesByIds(movieIds: string[]) {
        const movies = await this.repository.getByIds(movieIds)

        return this.toDtos(movies)
    }

    async moviesExist(movieIds: string[]): Promise<boolean> {
        return this.repository.existByIds(movieIds)
    }

    private toDto = (movie: MovieDocument) => {
        const dto = mapDocToDto(movie, MovieDto, [
            'id',
            'title',
            'genres',
            'releaseDate',
            'plot',
            'durationSeconds',
            'director',
            'rating'
        ])
        dto.images = movie.imageIds.map((id) => `${Routes.Http.StorageFiles}/${id.toString()}`)

        return dto
    }
    private toDtos = (movies: MovieDocument[]) => movies.map((movie) => this.toDto(movie))
}
