import { Injectable } from '@nestjs/common'
import { ClientProxyService, InjectClientProxy } from 'common'
import { Messages } from 'shared'
import { CreateShowtimeDto, ShowtimeDto, SearchShowtimesPageDto } from './dtos'
import { CreateShowtimesResult } from './types'

@Injectable()
export class ShowtimesClient {
    constructor(@InjectClientProxy() private proxy: ClientProxyService) {}

    createShowtimes(createDtos: CreateShowtimeDto[]): Promise<CreateShowtimesResult> {
        return this.proxy.getJson(Messages.Showtimes.createShowtimes, createDtos)
    }

    getShowtimes(showtimeIds: string[]): Promise<ShowtimeDto[]> {
        return this.proxy.getJson(Messages.Showtimes.getShowtimes, showtimeIds)
    }

    searchShowtimes(searchDto: SearchShowtimesPageDto): Promise<ShowtimeDto[]> {
        return this.proxy.getJson(Messages.Showtimes.searchShowtimes, searchDto)
    }

    searchShowingMovieIds(): Promise<string[]> {
        return this.proxy.getJson(Messages.Showtimes.searchShowingMovieIds, {})
    }

    searchTheaterIds(searchDto: SearchShowtimesPageDto): Promise<string[]> {
        return this.proxy.getJson(Messages.Showtimes.searchTheaterIds, searchDto)
    }

    searchShowdates(searchDto: SearchShowtimesPageDto): Promise<Date[]> {
        return this.proxy.getJson(Messages.Showtimes.searchShowdates, searchDto)
    }

    allShowtimesExist(showtimeIds: string[]): Promise<boolean> {
        return this.proxy.getJson(Messages.Showtimes.allShowtimesExist, showtimeIds)
    }
}
