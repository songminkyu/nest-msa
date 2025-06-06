import { Injectable, NotFoundException } from '@nestjs/common'
import { MoviesClient, ShowtimeDto, ShowtimesClient, TheatersClient } from 'apps/cores'
import { Assert, DateTimeRange, DateUtil, Time } from 'common'
import { ShowtimeBatchCreateJobData } from './types'

type TimeslotMap = Map<number, ShowtimeDto>

export const ShowtimeCreationValidatorServiceErrors = {
    MovieNotFound: {
        code: 'ERR_SHOWTIME_CREATION_MOVIE_NOT_FOUND',
        message: 'The requested movie could not be found.'
    },
    TheaterNotFound: {
        code: 'ERR_SHOWTIME_CREATION_THEATERS_NOT_FOUND',
        message: 'One or more requested theaters could not be found.'
    }
}

@Injectable()
export class ShowtimeCreationValidatorService {
    constructor(
        private theatersService: TheatersClient,
        private moviesService: MoviesClient,
        private showtimesService: ShowtimesClient
    ) {}

    async validate(data: ShowtimeBatchCreateJobData) {
        await this.verifyMovieExists(data.movieId)
        await this.verifyTheatersExist(data.theaterIds)

        const conflictingShowtimes = await this.findConflictingShowtimes(data)

        return { isValid: 0 === conflictingShowtimes.length, conflictingShowtimes }
    }

    private async findConflictingShowtimes(
        data: ShowtimeBatchCreateJobData
    ): Promise<ShowtimeDto[]> {
        const { durationMinutes, startTimes, theaterIds } = data

        const timeslotsByTheater = await this.generateTimeslotMapByTheater(data)

        const conflictingShowtimes: ShowtimeDto[] = []

        for (const theaterId of theaterIds) {
            const timeslots = timeslotsByTheater.get(theaterId)!

            Assert.defined(timeslots, `Timeslots must be defined for theater ID: ${theaterId}`)

            for (const start of startTimes) {
                const timeRange = DateTimeRange.create({ start, minutes: durationMinutes })

                iterateEvery10Mins(timeRange, (time) => {
                    const showtime = timeslots.get(time)

                    if (showtime) {
                        conflictingShowtimes.push(showtime)
                        return false
                    }
                })
            }
        }

        return conflictingShowtimes
    }

    private async generateTimeslotMapByTheater(
        data: ShowtimeBatchCreateJobData
    ): Promise<Map<string, TimeslotMap>> {
        const { theaterIds, durationMinutes, startTimes } = data

        const startDate = DateUtil.earliest(startTimes)
        const maxDate = DateUtil.latest(startTimes)
        const endDate = DateUtil.addMinutes(maxDate, durationMinutes)

        const timeslotsByTheater = new Map<string, TimeslotMap>()

        for (const theaterId of theaterIds) {
            const fetchedShowtimes = await this.showtimesService.searchShowtimes({
                theaterIds: [theaterId],
                startTimeRange: { start: startDate, end: endDate }
            })

            const timeslots = new Map<number, ShowtimeDto>()

            for (const showtime of fetchedShowtimes) {
                iterateEvery10Mins(showtime.timeRange, (time) => {
                    timeslots.set(time, showtime)
                })
            }

            timeslotsByTheater.set(theaterId, timeslots)
        }

        return timeslotsByTheater
    }

    private async verifyMovieExists(movieId: string): Promise<void> {
        const movieExists = await this.moviesService.moviesExist([movieId])

        if (!movieExists) {
            throw new NotFoundException({
                ...ShowtimeCreationValidatorServiceErrors.MovieNotFound,
                movieId
            })
        }
    }

    private async verifyTheatersExist(theaterIds: string[]): Promise<void> {
        const theatersExist = await this.theatersService.theatersExist(theaterIds)

        if (!theatersExist) {
            throw new NotFoundException({
                ...ShowtimeCreationValidatorServiceErrors.TheaterNotFound,
                theaterIds
            })
        }
    }
}

const iterateEvery10Mins = (
    timeRange: DateTimeRange,
    callback: (time: number) => boolean | void
) => {
    for (
        let time = timeRange.start.getTime();
        time <= timeRange.end.getTime();
        time = time + Time.toMs('10m')
    ) {
        if (false === callback(time)) {
            break
        }
    }
}
