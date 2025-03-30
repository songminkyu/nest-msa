import { Injectable } from '@nestjs/common'
import { mapDocToDto } from 'common'
import { ShowtimeCreateDto, ShowtimeDto, ShowtimeFilterDto } from './dtos'
import { ShowtimeDocument } from './models'
import { ShowtimesRepository } from './showtimes.repository'

@Injectable()
export class ShowtimesService {
    constructor(private repository: ShowtimesRepository) {}

    async createShowtimes(createDtos: ShowtimeCreateDto[]) {
        await this.repository.createShowtimes(createDtos)

        return { success: true, count: createDtos.length }
    }

    async getShowtimes(showtimeIds: string[]) {
        const showtimes = await this.repository.getByIds(showtimeIds)

        return this.toDtos(showtimes)
    }

    async findAllShowtimes(filterDto: ShowtimeFilterDto) {
        const showtimes = await this.repository.findAllShowtimes(filterDto)

        return this.toDtos(showtimes)
    }

    async findShowingMovieIds() {
        const currentTime = new Date()

        return this.repository.findMovieIds({ startTimeRange: { start: currentTime } })
    }

    async findTheaterIds(filterDto: ShowtimeFilterDto) {
        return this.repository.findTheaterIds(filterDto)
    }

    async findShowdates(filterDto: ShowtimeFilterDto) {
        return this.repository.findShowdates(filterDto)
    }

    private toDto = (showtime: ShowtimeDocument) =>
        mapDocToDto(showtime, ShowtimeDto, ['id', 'theaterId', 'movieId', 'startTime', 'endTime'])

    private toDtos = (showtimes: ShowtimeDocument[]) =>
        showtimes.map((showtime) => this.toDto(showtime))
}
