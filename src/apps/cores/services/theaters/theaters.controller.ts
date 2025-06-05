import { Controller } from '@nestjs/common'
import { MessagePattern, Payload } from '@nestjs/microservices'
import { Messages } from 'shared'
import { CreateTheaterDto, SearchTheatersDto, UpdateTheaterDto } from './dtos'
import { TheatersService } from './theaters.service'

@Controller()
export class TheatersController {
    constructor(private service: TheatersService) {}

    @MessagePattern(Messages.Theaters.createTheater)
    createTheater(@Payload() createDto: CreateTheaterDto) {
        return this.service.createTheater(createDto)
    }

    @MessagePattern(Messages.Theaters.updateTheater)
    updateTheater(
        @Payload('theaterId') theaterId: string,
        @Payload('updateDto') updateDto: UpdateTheaterDto
    ) {
        return this.service.updateTheater(theaterId, updateDto)
    }

    @MessagePattern(Messages.Theaters.getTheaters)
    getTheaters(@Payload() theaterIds: string[]) {
        return this.service.getTheaters(theaterIds)
    }

    @MessagePattern(Messages.Theaters.deleteTheaters)
    deleteTheaters(@Payload() theaterIds: string[]) {
        return this.service.deleteTheaters(theaterIds)
    }

    @MessagePattern(Messages.Theaters.searchTheatersPage)
    searchTheatersPage(@Payload() queryDto: SearchTheatersDto) {
        return this.service.searchTheatersPage(queryDto)
    }

    @MessagePattern(Messages.Theaters.theatersExist)
    theatersExist(@Payload() theaterIds: string[]) {
        return this.service.theatersExist(theaterIds)
    }
}
