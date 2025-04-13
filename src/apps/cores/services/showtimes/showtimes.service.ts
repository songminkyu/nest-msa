import { Injectable } from '@nestjs/common'
import { mapDocToDto } from 'common'
import { ShowtimeCreateDto, ShowtimeDto, ShowtimeQueryDto } from './dtos'
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

    async findAllShowtimes(queryDto: ShowtimeQueryDto) {
        const showtimes = await this.repository.findAllShowtimes(queryDto)

        return this.toDtos(showtimes)
    }

    async findShowingMovieIds() {
        const currentTime = new Date()

        return this.repository.findMovieIds({ startTimeRange: { start: currentTime } })
    }

    async findTheaterIds(queryDto: ShowtimeQueryDto) {
        return this.repository.findTheaterIds(queryDto)
    }

    async findShowdates(queryDto: ShowtimeQueryDto) {
        return this.repository.findShowdates(queryDto)
    }

    private toDto = (showtime: ShowtimeDocument) =>
        mapDocToDto(showtime, ShowtimeDto, ['id', 'theaterId', 'movieId', 'timeRange'])

    private toDtos = (showtimes: ShowtimeDocument[]) =>
        showtimes.map((showtime) => this.toDto(showtime))
}
