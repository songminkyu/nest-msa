import { Controller } from '@nestjs/common'
import { MessagePattern, Payload } from '@nestjs/microservices'
import { CommonQueryDto } from 'common'
import { Messages } from 'shared'
import { ShowtimeBatchCreateDto } from './dtos'
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

    @MessagePattern(Messages.ShowtimeCreation.findShowtimes)
    findShowtimes(@Payload() theaterIds: string[]) {
        return this.service.findShowtimes(theaterIds)
    }

    @MessagePattern(Messages.ShowtimeCreation.createBatchShowtimes)
    createBatchShowtimes(@Payload() createDto: ShowtimeBatchCreateDto) {
        return this.service.createBatchShowtimes(createDto)
    }
}
