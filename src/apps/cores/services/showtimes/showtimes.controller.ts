import { Controller, ParseArrayPipe } from '@nestjs/common'
import { MessagePattern, Payload } from '@nestjs/microservices'
import { Messages } from 'shared'
import { CreateShowtimeDto, SearchShowtimesDto } from './dtos'
import { ShowtimesService } from './showtimes.service'
import { CreateShowtimesResult } from './types'

@Controller()
export class ShowtimesController {
    constructor(private service: ShowtimesService) {}

    @MessagePattern(Messages.Showtimes.createShowtimes)
    createShowtimes(
        @Payload(new ParseArrayPipe({ items: CreateShowtimeDto })) createDtos: CreateShowtimeDto[]
    ): Promise<CreateShowtimesResult> {
        return this.service.createShowtimes(createDtos)
    }

    @MessagePattern(Messages.Showtimes.getShowtimes)
    getShowtimes(@Payload() showtimeIds: string[]) {
        return this.service.getShowtimes(showtimeIds)
    }

    @MessagePattern(Messages.Showtimes.searchShowtimes)
    searchShowtimes(@Payload() queryDto: SearchShowtimesDto) {
        return this.service.searchShowtimes(queryDto)
    }

    @MessagePattern(Messages.Showtimes.searchShowingMovieIds)
    searchShowingMovieIds() {
        return this.service.searchShowingMovieIds()
    }

    @MessagePattern(Messages.Showtimes.searchTheaterIds)
    searchTheaterIds(@Payload() queryDto: SearchShowtimesDto) {
        return this.service.searchTheaterIds(queryDto)
    }

    @MessagePattern(Messages.Showtimes.searchShowdates)
    searchShowdates(queryDto: SearchShowtimesDto) {
        return this.service.searchShowdates(queryDto)
    }

    @MessagePattern(Messages.Showtimes.showtimesExist)
    showtimesExist(@Payload() showtimeIds: string[]) {
        return this.service.showtimesExist(showtimeIds)
    }
}
