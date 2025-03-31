import { Injectable } from '@nestjs/common'
import { MovieDto, ShowtimeDto, TheaterDto } from 'apps/cores'
import { ClientProxyService, InjectClientProxy, CommonQueryDto } from 'common'
import { Messages } from 'shared'
import { ShowtimeBatchCreateDto, ShowtimeBatchCreateResponse } from './dtos'

@Injectable()
export class ShowtimeCreationClient {
    constructor(@InjectClientProxy() private proxy: ClientProxyService) {}

    findMovies(queryDto: CommonQueryDto): Promise<MovieDto[]> {
        return this.proxy.getJson(Messages.ShowtimeCreation.findMovies, queryDto)
    }

    findTheaters(queryDto: CommonQueryDto): Promise<TheaterDto[]> {
        return this.proxy.getJson(Messages.ShowtimeCreation.findTheaters, queryDto)
    }

    findShowtimes(theaterIds: string[]): Promise<ShowtimeDto[]> {
        return this.proxy.getJson(Messages.ShowtimeCreation.findShowtimes, theaterIds)
    }

    createBatchShowtimes(createDto: ShowtimeBatchCreateDto): Promise<ShowtimeBatchCreateResponse> {
        return this.proxy.getJson(Messages.ShowtimeCreation.createBatchShowtimes, createDto)
    }
}
