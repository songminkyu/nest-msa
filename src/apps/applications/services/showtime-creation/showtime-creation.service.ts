import { Injectable } from '@nestjs/common'
import { newObjectId, CommonQueryDto } from 'common'
import { MoviesClient, ShowtimesClient, TheatersClient } from 'apps/cores'
import { CreateShowtimeBatchDto, CreateShowtimeBatchResponse } from './dtos'
import { ShowtimeCreationWorkerService } from './services'

@Injectable()
export class ShowtimeCreationService {
    constructor(
        private theatersService: TheatersClient,
        private moviesService: MoviesClient,
        private showtimesService: ShowtimesClient,
        private batchCreationService: ShowtimeCreationWorkerService
    ) {}

    async searchMoviesPage(queryDto: CommonQueryDto) {
        return this.moviesService.searchMoviesPage(queryDto)
    }

    async searchTheatersPage(queryDto: CommonQueryDto) {
        return this.theatersService.searchTheatersPage(queryDto)
    }

    async searchShowtimes(theaterIds: string[]) {
        return this.showtimesService.searchShowtimes({
            theaterIds,
            endTimeRange: { start: new Date() }
        })
    }

    async createBatchShowtimes(createDto: CreateShowtimeBatchDto) {
        const batchId = newObjectId()

        this.batchCreationService.enqueueTask({ ...createDto, batchId })

        return { batchId } as CreateShowtimeBatchResponse
    }
}
