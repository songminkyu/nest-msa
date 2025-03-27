import { Injectable } from '@nestjs/common'
import { ClientProxyService, InjectClientProxy } from 'common'
import { Messages } from 'shared'
import { ShowtimeCreateDto, ShowtimeDto, ShowtimeFilterDto } from './dtos'

@Injectable()
export class ShowtimesClient {
    constructor(@InjectClientProxy() private proxy: ClientProxyService) {}

    createShowtimes(createDtos: ShowtimeCreateDto[]): Promise<{ success: true; count: number }> {
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

    findTheaterIdsByMovieId(movieId: string): Promise<string[]> {
        return this.proxy.getJson(Messages.Showtimes.findTheaterIdsByMovieId, movieId)
    }

    findShowdates(args: { movieId: string; theaterId: string }): Promise<Date[]> {
        return this.proxy.getJson(Messages.Showtimes.findShowdates, args)
    }
}
