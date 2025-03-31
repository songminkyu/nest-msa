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

    @MessagePattern(Messages.Showtimes.findAllShowtimes)
    findAllShowtimes(@Payload() queryDto: ShowtimeQueryDto) {
        return this.service.findAllShowtimes(queryDto)
    }

    @MessagePattern(Messages.Showtimes.findShowingMovieIds)
    findShowingMovieIds() {
        return this.service.findShowingMovieIds()
    }

    @MessagePattern(Messages.Showtimes.findTheaterIds)
    findTheaterIds(@Payload() queryDto: ShowtimeQueryDto) {
        return this.service.findTheaterIds(queryDto)
    }

    @MessagePattern(Messages.Showtimes.findShowdates)
    findShowdates(queryDto: ShowtimeQueryDto) {
        return this.service.findShowdates(queryDto)
    }
}
