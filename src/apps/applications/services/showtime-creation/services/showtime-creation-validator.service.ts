import { Injectable, NotFoundException } from '@nestjs/common'
import { MoviesClient, ShowtimeDto, ShowtimesClient, TheatersClient } from 'apps/cores'
import { Assert, DateUtil } from 'common'
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
        await this.ensureMovieExists(data.movieId)
        await this.ensureTheatersExist(data.theaterIds)

        const conflictingShowtimes = await this.checkTimeConflicts(data)

        return conflictingShowtimes
    }

    private async checkTimeConflicts(data: ShowtimeBatchCreateJobData): Promise<ShowtimeDto[]> {
        const { durationMinutes, startTimes, theaterIds } = data

        const timeslotsByTheater = await this.generateTimeslotMapByTheater(data)

        const conflictingShowtimes: ShowtimeDto[] = []

        for (const theaterId of theaterIds) {
            const timeslots = timeslotsByTheater.get(theaterId)!

            Assert.defined(timeslots, `Timeslots must be defined for theater ID: ${theaterId}`)

            for (const startTime of startTimes) {
                const endTime = DateUtil.addMinutes(startTime, durationMinutes)

                iterateEvery10Mins(startTime, endTime, (time) => {
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

        const timeslotMapByTheater = new Map<string, TimeslotMap>()

        for (const theaterId of theaterIds) {
            const fetchedShowtimes = await this.showtimesService.findAllShowtimes({
                theaterIds: [theaterId],
                startTimeRange: { start: startDate, end: endDate }
            })

            const timeslots = new Map<number, ShowtimeDto>()

            for (const showtime of fetchedShowtimes) {
                iterateEvery10Mins(showtime.startTime, showtime.endTime, (time) => {
                    timeslots.set(time, showtime)
                })
            }

            timeslotMapByTheater.set(theaterId, timeslots)
        }

        return timeslotMapByTheater
    }

    private async ensureMovieExists(movieId: string): Promise<void> {
        const movieExists = await this.moviesService.moviesExist([movieId])
        if (!movieExists) {
            throw new NotFoundException({
                ...ShowtimeCreationValidatorServiceErrors.MovieNotFound,
                movieId
            })
        }
    }

    private async ensureTheatersExist(theaterIds: string[]): Promise<void> {
        const theatersExist = await this.theatersService.theatersExist(theaterIds)
        if (!theatersExist) {
            throw new NotFoundException({
                ...ShowtimeCreationValidatorServiceErrors.TheaterNotFound,
                theaterIds
            })
        }
    }
}

const iterateEvery10Mins = (start: Date, end: Date, callback: (time: number) => boolean | void) => {
    for (let time = start.getTime(); time <= end.getTime(); time = time + 10 * 60 * 1000) {
        if (false === callback(time)) {
            break
        }
    }
}
