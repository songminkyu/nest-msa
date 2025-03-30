import { Injectable } from '@nestjs/common'
import { ClientProxyService, InjectClientProxy } from 'common'
import { Messages } from 'shared'
import {
    ShowtimeCreateDto,
    ShowtimeDto,
    ShowtimeFilterDto,
    TheaterInShowtimeFilterDto
} from './dtos'
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

    findAllShowtimes(filterDto: ShowtimeFilterDto): Promise<ShowtimeDto[]> {
        return this.proxy.getJson(Messages.Showtimes.findAllShowtimes, filterDto)
    }

    findShowingMovieIds(): Promise<string[]> {
        return this.proxy.getJson(Messages.Showtimes.findShowingMovieIds, {})
    }

    findTheaterIds(filterDto: TheaterInShowtimeFilterDto): Promise<string[]> {
        return this.proxy.getJson(Messages.Showtimes.findTheaterIds, filterDto)
    }

    findShowdates(args: { movieId: string; theaterId: string }): Promise<Date[]> {
        return this.proxy.getJson(Messages.Showtimes.findShowdates, args)
    }
}
