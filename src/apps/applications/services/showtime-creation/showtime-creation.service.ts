import { Injectable } from '@nestjs/common'
import { MoviesClient, ShowtimesClient, TheatersClient } from 'apps/cores'
import { CommonQueryDto, newObjectId, OrderDirection } from 'common'
import { CreateShowtimeBatchDto, RequestShowtimeCreationResponse } from './dtos'
import { ShowtimeCreationWorkerService } from './services'

@Injectable()
export class ShowtimeCreationService {
    constructor(
        private theatersService: TheatersClient,
        private moviesService: MoviesClient,
        private showtimesService: ShowtimesClient,
        private workerService: ShowtimeCreationWorkerService
    ) {}

    async searchMoviesPage(searchDto: CommonQueryDto) {
        return this.moviesService.searchMoviesPage({
            ...searchDto,
            orderby: { name: 'releaseDate', direction: OrderDirection.Desc }
        })
    }

    async searchTheatersPage(searchDto: CommonQueryDto) {
        return this.theatersService.searchTheatersPage(searchDto)
    }

    async searchShowtimes(theaterIds: string[]) {
        return this.showtimesService.searchShowtimes({
            theaterIds,
            endTimeRange: { start: new Date() }
        })
    }

    async requestShowtimeCreation(createDto: CreateShowtimeBatchDto) {
        const transactionId = newObjectId()

        this.workerService.enqueueTask({ createDto, transactionId })

        return { transactionId } as RequestShowtimeCreationResponse
    }
}
