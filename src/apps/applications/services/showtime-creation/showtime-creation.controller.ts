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
    searchMoviesPage(@Payload() queryDto: CommonQueryDto) {
        return this.service.searchMoviesPage(queryDto)
    }

    @MessagePattern(Messages.ShowtimeCreation.searchTheatersPage)
    searchTheatersPage(@Payload() queryDto: CommonQueryDto) {
        return this.service.searchTheatersPage(queryDto)
    }

    @MessagePattern(Messages.ShowtimeCreation.searchShowtimes)
    searchShowtimes(@Payload() theaterIds: string[]) {
        return this.service.searchShowtimes(theaterIds)
    }

    @MessagePattern(Messages.ShowtimeCreation.createBatchShowtimes)
    createBatchShowtimes(@Payload() createDto: CreateShowtimeBatchDto) {
        return this.service.createBatchShowtimes(createDto)
    }
}
