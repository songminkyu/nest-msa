import { Injectable } from '@nestjs/common'
import { ClientProxyService, InjectClientProxy } from 'common'
import { Messages } from 'shared'
import { TheaterCreateDto, TheaterDto, TheaterQueryDto, TheaterUpdateDto } from './dtos'

@Injectable()
export class TheatersClient {
    constructor(@InjectClientProxy() private service: ClientProxyService) {}

    createTheater(createDto: TheaterCreateDto): Promise<TheaterDto> {
        return this.service.getJson(Messages.Theaters.createTheater, createDto)
    }

    updateTheater(theaterId: string, updateDto: TheaterUpdateDto): Promise<TheaterDto> {
        return this.service.getJson(Messages.Theaters.updateTheater, { theaterId, updateDto })
    }

    getTheater(theaterId: string): Promise<TheaterDto> {
        return this.service.getJson(Messages.Theaters.getTheater, theaterId)
    }

    deleteTheater(theaterId: string): Promise<boolean> {
        return this.service.getJson(Messages.Theaters.deleteTheater, theaterId)
    }

    findTheaters(queryDto: TheaterQueryDto): Promise<TheaterDto[]> {
        return this.service.getJson(Messages.Theaters.findTheaters, queryDto)
    }

    getTheatersByIds(theaterIds: string[]): Promise<TheaterDto[]> {
        return this.service.getJson(Messages.Theaters.getTheatersByIds, theaterIds)
    }

    theatersExist(theaterIds: string[]): Promise<boolean> {
        return this.service.getJson(Messages.Theaters.theatersExist, theaterIds)
    }
}
