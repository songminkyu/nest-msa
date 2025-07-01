import { Injectable, NotFoundException } from '@nestjs/common'
import { MoviesClient, ShowtimeDto, ShowtimesClient, TheatersClient } from 'apps/cores'
import { Assert, DateTimeRange, DateUtil, Time } from 'common'
import { Rules } from 'shared'
import { BulkCreateShowtimesDto } from '../dtos'

type TimeslotMap = Map<number, ShowtimeDto>

export const ShowtimeBulkValidatorServiceErrors = {
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
export class ShowtimeBulkValidatorService {
    constructor(
        private theatersService: TheatersClient,
        private moviesService: MoviesClient,
        private showtimesService: ShowtimesClient
    ) {}

    async validate(createDto: BulkCreateShowtimesDto) {
        await this.verifyMovieExists(createDto.movieId)
        await this.verifyTheatersExist(createDto.theaterIds)

        const conflictingShowtimes = await this.findConflictingShowtimes(createDto)

        return { isValid: 0 === conflictingShowtimes.length, conflictingShowtimes }
    }

    private async findConflictingShowtimes(createDto: BulkCreateShowtimesDto) {
        const { durationInMinutes, startTimes, theaterIds } = createDto

        const timeslotsByTheater = await this.generateTimeslotMapByTheater(createDto)

        const conflictingShowtimes: ShowtimeDto[] = []

        for (const theaterId of theaterIds) {
            const timeslots = timeslotsByTheater.get(theaterId)!

            Assert.defined(timeslots, `Timeslots must be defined for theater ID: ${theaterId}`)

            for (const start of startTimes) {
                const timeRange = DateTimeRange.create({ start, minutes: durationInMinutes })

                iterateShowtimeUnitInMinutes(timeRange, (time) => {
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

    private async generateTimeslotMapByTheater(createDto: BulkCreateShowtimesDto) {
        const { theaterIds, durationInMinutes, startTimes } = createDto

        const startDate = DateUtil.earliest(startTimes)
        const maxDate = DateUtil.latest(startTimes)
        const endDate = DateUtil.addMinutes(maxDate, durationInMinutes)

        const timeslotsByTheater = new Map<string, TimeslotMap>()

        for (const theaterId of theaterIds) {
            const fetchedShowtimes = await this.showtimesService.searchShowtimes({
                theaterIds: [theaterId],
                startTimeRange: { start: startDate, end: endDate }
            })

            const timeslots = new Map<number, ShowtimeDto>()

            for (const showtime of fetchedShowtimes) {
                const { startTime: start, endTime: end } = showtime

                iterateShowtimeUnitInMinutes({ start, end }, (time) => {
                    timeslots.set(time, showtime)
                })
            }

            timeslotsByTheater.set(theaterId, timeslots)
        }

        return timeslotsByTheater
    }

    private async verifyMovieExists(movieId: string) {
        const movieExists = await this.moviesService.moviesExist([movieId])

        if (!movieExists) {
            throw new NotFoundException({
                ...ShowtimeBulkValidatorServiceErrors.MovieNotFound,
                movieId
            })
        }
    }

    private async verifyTheatersExist(theaterIds: string[]) {
        const theatersExist = await this.theatersService.theatersExist(theaterIds)

        if (!theatersExist) {
            throw new NotFoundException({
                ...ShowtimeBulkValidatorServiceErrors.TheaterNotFound,
                theaterIds
            })
        }
    }
}

const iterateShowtimeUnitInMinutes = (
    timeRange: DateTimeRange,
    callback: (time: number) => boolean | void
) => {
    for (
        let time = timeRange.start.getTime();
        time <= timeRange.end.getTime();
        time = time + Time.toMs(`${Rules.Showtime.slotMinutes}m`)
    ) {
        if (false === callback(time)) {
            break
        }
    }
}
