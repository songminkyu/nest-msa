import { Controller } from '@nestjs/common'
import { MessagePattern, Payload } from '@nestjs/microservices'
import { CommonQueryDto } from 'common'
import { Messages } from 'shared'
import { CreateShowtimeBatchDto } from './dtos'
import { ShowtimeCreationService } from './showtime-creation.service'

@Controller()
export class ShowtimeCreationController {
    constructor(private service: ShowtimeCreationService) {}

    @MessagePattern(Messages.ShowtimeCreation.searchMoviesPage)
    searchMoviesPage(@Payload() searchDto: CommonQueryDto) {
        return this.service.searchMoviesPage(searchDto)
    }

    @MessagePattern(Messages.ShowtimeCreation.searchTheatersPage)
    searchTheatersPage(@Payload() searchDto: CommonQueryDto) {
        return this.service.searchTheatersPage(searchDto)
    }

    @MessagePattern(Messages.ShowtimeCreation.searchShowtimes)
    searchShowtimes(@Payload() theaterIds: string[]) {
        return this.service.searchShowtimes(theaterIds)
    }

    @MessagePattern(Messages.ShowtimeCreation.enqueueShowtimeBatch)
    enqueueShowtimeBatch(@Payload() createDto: CreateShowtimeBatchDto) {
        return this.service.enqueueShowtimeBatch(createDto)
    }
}
