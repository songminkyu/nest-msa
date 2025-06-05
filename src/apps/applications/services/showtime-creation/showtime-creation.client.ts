import { Injectable } from '@nestjs/common'
import { MovieDto, ShowtimeDto, TheaterDto } from 'apps/cores'
import { ClientProxyService, CommonQueryDto, InjectClientProxy } from 'common'
import { Events, Messages } from 'shared'
import { CreateShowtimeBatchDto, CreateShowtimeBatchResponse } from './dtos'

@Injectable()
export class ShowtimeCreationClient {
    constructor(@InjectClientProxy() private proxy: ClientProxyService) {}

    searchMoviesPage(searchDto: CommonQueryDto): Promise<MovieDto[]> {
        return this.proxy.getJson(Messages.ShowtimeCreation.searchMoviesPage, searchDto)
    }

    searchTheatersPage(searchDto: CommonQueryDto): Promise<TheaterDto[]> {
        return this.proxy.getJson(Messages.ShowtimeCreation.searchTheatersPage, searchDto)
    }

    searchShowtimes(theaterIds: string[]): Promise<ShowtimeDto[]> {
        return this.proxy.getJson(Messages.ShowtimeCreation.searchShowtimes, theaterIds)
    }

    createBatchShowtimes(createDto: CreateShowtimeBatchDto): Promise<CreateShowtimeBatchResponse> {
        return this.proxy.getJson(Messages.ShowtimeCreation.createBatchShowtimes, createDto)
    }

    emitStatusChanged(payload: any) {
        return this.proxy.emit(Events.ShowtimeCreation.statusChanged, payload)
    }
}
