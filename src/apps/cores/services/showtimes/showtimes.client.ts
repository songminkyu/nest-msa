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

    findAllShowtimes(queryDto: ShowtimeQueryDto): Promise<ShowtimeDto[]> {
        return this.proxy.getJson(Messages.Showtimes.findAllShowtimes, queryDto)
    }

    findShowingMovieIds(): Promise<string[]> {
        return this.proxy.getJson(Messages.Showtimes.findShowingMovieIds, {})
    }

    findTheaterIds(queryDto: ShowtimeQueryDto): Promise<string[]> {
        return this.proxy.getJson(Messages.Showtimes.findTheaterIds, queryDto)
    }

    findShowdates(queryDto: ShowtimeQueryDto): Promise<Date[]> {
        return this.proxy.getJson(Messages.Showtimes.findShowdates, queryDto)
    }
}
