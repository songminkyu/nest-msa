import { Injectable } from '@nestjs/common'
import { ClientProxyService, InjectClientProxy } from 'common'
import { Messages } from 'shared'
import { TheaterCreateDto, TheaterDto, TheaterQueryDto, TheaterUpdateDto } from './dtos'

@Injectable()
export class TheatersClient {
    constructor(@InjectClientProxy() private proxy: ClientProxyService) {}

    createTheater(createDto: TheaterCreateDto): Promise<TheaterDto> {
        return this.proxy.getJson(Messages.Theaters.createTheater, createDto)
    }

    updateTheater(theaterId: string, updateDto: TheaterUpdateDto): Promise<TheaterDto> {
        return this.proxy.getJson(Messages.Theaters.updateTheater, { theaterId, updateDto })
    }

    getTheaters(theaterIds: string[]): Promise<TheaterDto[]> {
        return this.proxy.getJson(Messages.Theaters.getTheaters, theaterIds)
    }

    deleteTheaters(theaterIds: string[]): Promise<boolean> {
        return this.proxy.getJson(Messages.Theaters.deleteTheaters, theaterIds)
    }

    findTheaters(queryDto: TheaterQueryDto): Promise<TheaterDto[]> {
        return this.proxy.getJson(Messages.Theaters.findTheaters, queryDto)
    }

    getTheatersByIds(theaterIds: string[]): Promise<TheaterDto[]> {
        return this.proxy.getJson(Messages.Theaters.getTheatersByIds, theaterIds)
    }

    theatersExist(theaterIds: string[]): Promise<boolean> {
        return this.proxy.getJson(Messages.Theaters.theatersExist, theaterIds)
    }
}
