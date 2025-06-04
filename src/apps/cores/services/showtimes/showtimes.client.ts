import { Injectable } from '@nestjs/common'
import { ClientProxyService, InjectClientProxy } from 'common'
import { Messages } from 'shared'
import { ShowtimeCreateDto, ShowtimeDto, ShowtimeQueryDto } from './dtos'
import { CreateShowtimesResult } from './types'

@Injectable()
export class ShowtimesClient {
    constructor(@InjectClientProxy() private proxy: ClientProxyService) {}

    createShowtimes(createDtos: ShowtimeCreateDto[]): Promise<CreateShowtimesResult> {
        return this.proxy.getJson(Messages.Showtimes.createShowtimes, createDtos)
    }

    getShowtimes(showtimeIds: string[]): Promise<ShowtimeDto[]> {
        return this.proxy.getJson(Messages.Showtimes.getShowtimes, showtimeIds)
    }

    searchShowtimes(queryDto: ShowtimeQueryDto): Promise<ShowtimeDto[]> {
        return this.proxy.getJson(Messages.Showtimes.searchShowtimes, queryDto)
    }

    searchShowingMovieIds(): Promise<string[]> {
        return this.proxy.getJson(Messages.Showtimes.searchShowingMovieIds, {})
    }

    searchTheaterIds(queryDto: ShowtimeQueryDto): Promise<string[]> {
        return this.proxy.getJson(Messages.Showtimes.searchTheaterIds, queryDto)
    }

    searchShowdates(queryDto: ShowtimeQueryDto): Promise<Date[]> {
        return this.proxy.getJson(Messages.Showtimes.searchShowdates, queryDto)
    }

    showtimesExist(showtimeIds: string[]): Promise<boolean> {
        return this.proxy.getJson(Messages.Showtimes.showtimesExist, showtimeIds)
    }
}
