import { MovieDto, ShowtimeCreateDto, TheaterDto } from 'apps/cores'
import { DateUtil, jsonToObject } from 'common'
import { HttpTestClient, nullObjectId } from 'testlib'
import { createMovie } from './movies.fixture'
import { createTheater } from './theaters.fixture'
import { CommonFixture, createCommonFixture } from './utils'

export const createShowtimeDtos = (startTimes: Date[], overrides = {}) => {
    const createDtos: ShowtimeCreateDto[] = []

    startTimes.map((startTime) => {
        const createDto = {
            batchId: nullObjectId,
            movieId: nullObjectId,
            theaterId: nullObjectId,
            startTime,
            endTime: DateUtil.addMinutes(startTime, 90),
            ...overrides
        }

        createDtos.push(createDto)
    })

    return createDtos
}

export const monitorEvents = (client: HttpTestClient, waitStatuses: string[]) => {
    return new Promise((resolve, reject) => {
        client.get('/showtime-creation/events').sse((data) => {
            const result = jsonToObject(JSON.parse(data))

            if (['complete', 'fail', 'error'].includes(result.status)) {
                if (waitStatuses.includes(result.status)) {
                    resolve(result)
                } else {
                    reject(result)
                }
            } else if (!result.status) {
                reject(data)
            }
        }, reject)
    })
}

export class Fixture extends CommonFixture {
    teardown: () => Promise<void>
    movie: MovieDto
    theater: TheaterDto
}

export const createFixture = async () => {
    const commonFixture = await createCommonFixture()
    const movie = await createMovie(commonFixture)
    const theater = await createTheater(commonFixture)

    const teardown = async () => {
        await commonFixture?.close()
    }

    return { ...commonFixture, teardown, movie, theater }
}
