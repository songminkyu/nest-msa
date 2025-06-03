import { Injectable } from '@nestjs/common'
import { MovieDto, ShowtimeDto, TheaterDto } from 'apps/cores'
import { ClientProxyService, CommonQueryDto, InjectClientProxy } from 'common'
import { Events, Messages } from 'shared'
import { ShowtimeBatchCreateDto, ShowtimeBatchCreateResponse } from './dtos'

@Injectable()
export class ShowtimeCreationClient {
    constructor(@InjectClientProxy() private proxy: ClientProxyService) {}

    searchMoviesPage(queryDto: CommonQueryDto): Promise<MovieDto[]> {
        return this.proxy.getJson(Messages.ShowtimeCreation.searchMoviesPage, queryDto)
    }

    searchTheatersPage(queryDto: CommonQueryDto): Promise<TheaterDto[]> {
        return this.proxy.getJson(Messages.ShowtimeCreation.searchTheatersPage, queryDto)
    }

    findShowtimes(theaterIds: string[]): Promise<ShowtimeDto[]> {
        return this.proxy.getJson(Messages.ShowtimeCreation.findShowtimes, theaterIds)
    }

    createBatchShowtimes(createDto: ShowtimeBatchCreateDto): Promise<ShowtimeBatchCreateResponse> {
        return this.proxy.getJson(Messages.ShowtimeCreation.createBatchShowtimes, createDto)
    }

    emitStatusChanged(payload: any) {
        return this.proxy.emit(Events.ShowtimeCreation.statusChanged, payload)
    }
}
