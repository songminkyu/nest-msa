import { Injectable } from '@nestjs/common'
import { MoviesClient, ShowtimesClient, TheatersClient } from 'apps/cores'
import { PaginationDto, OrderDirection } from 'common'
import { BulkCreateShowtimesDto, RequestShowtimeCreationResponse } from './dtos'
import { ShowtimeCreationWorkerService } from './services'

@Injectable()
export class ShowtimeCreationService {
    constructor(
        private theatersService: TheatersClient,
        private moviesService: MoviesClient,
        private showtimesService: ShowtimesClient,
        private workerService: ShowtimeCreationWorkerService
    ) {}

    async searchMoviesPage(searchDto: PaginationDto) {
        return this.moviesService.searchMoviesPage({
            ...searchDto,
            orderby: { name: 'releaseDate', direction: OrderDirection.Desc }
        })
    }

    async searchTheatersPage(searchDto: PaginationDto) {
        return this.theatersService.searchTheatersPage(searchDto)
    }

    async searchShowtimes(theaterIds: string[]) {
        return this.showtimesService.searchShowtimes({
            theaterIds,
            endTimeRange: { start: new Date() }
        })
    }

    async requestShowtimeCreation(createDto: BulkCreateShowtimesDto) {
        const transactionId = await this.workerService.requestShowtimeCreation(createDto)

        return { transactionId } as RequestShowtimeCreationResponse
    }
}
