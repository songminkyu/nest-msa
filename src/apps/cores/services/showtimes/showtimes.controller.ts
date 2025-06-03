import { Controller, ParseArrayPipe } from '@nestjs/common'
import { MessagePattern, Payload } from '@nestjs/microservices'
import { Messages } from 'shared'
import { ShowtimeCreateDto, ShowtimeQueryDto } from './dtos'
import { ShowtimesService } from './showtimes.service'
import { CreateShowtimesResult } from './types'

@Controller()
export class ShowtimesController {
    constructor(private service: ShowtimesService) {}

    @MessagePattern(Messages.Showtimes.createShowtimes)
    createShowtimes(
        @Payload(new ParseArrayPipe({ items: ShowtimeCreateDto })) createDtos: ShowtimeCreateDto[]
    ): Promise<CreateShowtimesResult> {
        return this.service.createShowtimes(createDtos)
    }

    @MessagePattern(Messages.Showtimes.getShowtimes)
    getShowtimes(@Payload() showtimeIds: string[]) {
        return this.service.getShowtimes(showtimeIds)
    }

    @MessagePattern(Messages.Showtimes.searchShowtimes)
    searchShowtimes(@Payload() queryDto: ShowtimeQueryDto) {
        return this.service.searchShowtimes(queryDto)
    }

    @MessagePattern(Messages.Showtimes.searchShowingMovieIds)
    searchShowingMovieIds() {
        return this.service.searchShowingMovieIds()
    }

    @MessagePattern(Messages.Showtimes.searchTheaterIds)
    searchTheaterIds(@Payload() queryDto: ShowtimeQueryDto) {
        return this.service.searchTheaterIds(queryDto)
    }

    @MessagePattern(Messages.Showtimes.searchShowdates)
    searchShowdates(queryDto: ShowtimeQueryDto) {
        return this.service.searchShowdates(queryDto)
    }
}
