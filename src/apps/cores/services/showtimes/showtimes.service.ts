import { Injectable } from '@nestjs/common'
import { mapDocToDto } from 'common'
import { CreateShowtimeDto, ShowtimeDto, SearchShowtimesDto } from './dtos'
import { ShowtimeDocument } from './models'
import { ShowtimesRepository } from './showtimes.repository'

@Injectable()
export class ShowtimesService {
    constructor(private repository: ShowtimesRepository) {}

    async createShowtimes(createDtos: CreateShowtimeDto[]) {
        await this.repository.createShowtimes(createDtos)

        return { success: true, count: createDtos.length }
    }

    async getShowtimes(showtimeIds: string[]) {
        const showtimes = await this.repository.getByIds(showtimeIds)

        return this.toDtos(showtimes)
    }

    async searchShowtimes(queryDto: SearchShowtimesDto) {
        const showtimes = await this.repository.searchShowtimes(queryDto)

        return this.toDtos(showtimes)
    }

    async searchShowingMovieIds() {
        const currentTime = new Date()

        return this.repository.findMovieIds({ startTimeRange: { start: currentTime } })
    }

    async searchTheaterIds(queryDto: SearchShowtimesDto) {
        return this.repository.searchTheaterIds(queryDto)
    }

    async searchShowdates(queryDto: SearchShowtimesDto) {
        return this.repository.searchShowdates(queryDto)
    }

    async showtimesExist(showtimeIds: string[]): Promise<boolean> {
        return this.repository.existByIds(showtimeIds)
    }

    private toDto = (showtime: ShowtimeDocument) =>
        mapDocToDto(showtime, ShowtimeDto, ['id', 'theaterId', 'movieId', 'timeRange'])

    private toDtos = (showtimes: ShowtimeDocument[]) =>
        showtimes.map((showtime) => this.toDto(showtime))
}
