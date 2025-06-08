import { MovieDto, CreateShowtimeDto, TheaterDto } from 'apps/cores'
import { comment, DateTimeRange, jsonToObject, notUsed } from 'common'
import { HttpTestClient, nullObjectId } from 'testlib'
import { createMovie, createTheater } from './common.fixture'
import { CommonFixture, createCommonFixture } from './utils'

export const createShowtimeDtos = (startTimes: Date[], overrides = {}) => {
    const createDtos: CreateShowtimeDto[] = []

    startTimes.map((startTime) => {
        const createDto = {
            transactionId: nullObjectId,
            movieId: nullObjectId,
            theaterId: nullObjectId,
            timeRange: DateTimeRange.create({ start: startTime, minutes: 90 }),
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

            if (['waiting', 'processing'].includes(result.status)) {
                notUsed('Ignore incomplete statuses')
            } else if (['succeeded', 'failed', 'error'].includes(result.status)) {
                if (waitStatuses.includes(result.status)) {
                    resolve(result)
                } else {
                    reject(result)
                }
            } else {
                reject(data)
            }
        }, reject)
    })
}

export interface Fixture extends CommonFixture {
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
