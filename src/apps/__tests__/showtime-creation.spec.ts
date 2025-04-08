import { Seatmap, ShowtimeDto } from 'apps/cores'
import { expectEqualUnsorted, nullObjectId } from 'testlib'
import { createShowtimeDtos, Fixture, monitorEvents } from './showtime-creation.fixture'
import { createShowtimes } from './showtimes.fixture'

describe('/showtime-creation', () => {
    let fix: Fixture

    beforeEach(async () => {
        const { createFixture } = await import('./showtime-creation.fixture')
        fix = await createFixture()
    })

    afterEach(async () => {
        await fix?.teardown()
    })

    it('영화 목록 요청', async () => {
        const { body } = await fix.httpClient
            .get('/showtime-creation/movies')
            .query({ skip: 0 })
            .ok()
        const { items, ...paginated } = body

        expect(paginated).toEqual({ skip: 0, take: expect.any(Number), total: 1 })
        expect(items).toEqual([fix.movie])
    })

    it('극장 목록 요청', async () => {
        const { body } = await fix.httpClient
            .get('/showtime-creation/theaters')
            .query({ skip: 0 })
            .ok()
        const { items, ...paginated } = body

        expect(paginated).toEqual({ skip: 0, take: expect.any(Number), total: 1 })
        expect(items).toEqual([fix.theater])
    })

    describe('상영시간 목록 요청', () => {
        let showtimes: ShowtimeDto[]

        beforeEach(async () => {
            const createDtos = createShowtimeDtos(
                [
                    new Date('2100-01-01T09:00'),
                    new Date('2100-01-01T11:00'),
                    new Date('2100-01-01T13:00')
                ],
                { theaterId: fix.theater.id }
            )

            showtimes = await createShowtimes(fix, createDtos)
        })

        it('예정된 상영시간 목록을 반환해야 한다', async () => {
            const { body } = await fix.httpClient
                .post('/showtime-creation/showtimes/find')
                .body({ theaterIds: [fix.theater.id] })
                .ok()

            expectEqualUnsorted(body, showtimes)
        })
    })

    describe('상영시간 등록 요청', () => {
        const createBatchShowtimes = async (
            movieId: string,
            theaterIds: string[],
            startTimes: Date[],
            durationMinutes: number
        ) => {
            const { body } = await fix.httpClient
                .post('/showtime-creation/showtimes')
                .body({ movieId, theaterIds, startTimes, durationMinutes })
                .accepted()

            return body
        }

        it('상영시간 등록 요청이 성공해야 한다', async () => {
            const monitorPromise = monitorEvents(fix.httpClient, ['complete'])

            const theaterIds = [fix.theater.id]
            const startTimes = [
                new Date('2100-01-01T09:00'),
                new Date('2100-01-01T11:00'),
                new Date('2100-01-01T13:00')
            ]

            const { batchId } = await createBatchShowtimes(fix.movie.id, theaterIds, startTimes, 90)

            expect(batchId).toBeDefined()

            const seatCount = Seatmap.getSeatCount(fix.theater.seatmap)
            const showtimeCreatedCount = theaterIds.length * startTimes.length
            const ticketCreatedCount = showtimeCreatedCount * seatCount

            await expect(monitorPromise).resolves.toEqual({
                batchId,
                status: 'complete',
                showtimeCreatedCount,
                ticketCreatedCount
            })
        })

        it('movie가 존재하지 않으면 작업 요청이 실패해야 한다', async () => {
            const monitorPromise = monitorEvents(fix.httpClient, ['error'])

            const { batchId } = await createBatchShowtimes(
                nullObjectId,
                [fix.theater.id],
                [new Date(0)],
                90
            )

            expect(batchId).toBeDefined()

            await expect(monitorPromise).resolves.toEqual({
                batchId,
                status: 'error',
                message: 'The requested movie could not be found.'
            })
        })

        it('theater가 존재하지 않으면 작업 요청이 실패해야 한다', async () => {
            const monitorPromise = monitorEvents(fix.httpClient, ['error'])

            const { batchId } = await createBatchShowtimes(
                fix.movie.id,
                [nullObjectId],
                [new Date(0)],
                90
            )

            expect(batchId).toBeDefined()

            await expect(monitorPromise).resolves.toEqual({
                batchId,
                status: 'error',
                message: 'One or more requested theaters could not be found.'
            })
        })
    })

    describe('상영시간 충돌 점검', () => {
        let showtimes: ShowtimeDto[]

        beforeEach(async () => {
            const createDtos = createShowtimeDtos(
                [
                    new Date('2013-01-31T12:00'),
                    new Date('2013-01-31T14:00'),
                    new Date('2013-01-31T16:30'),
                    new Date('2013-01-31T18:30')
                ],
                { theaterId: fix.theater.id, durationMinutes: 90 }
            )

            showtimes = await createShowtimes(fix, createDtos)
        })

        it('생성 요청이 기존 상영시간 충돌할 때 충돌 정보를 반환해야 한다', async () => {
            const monitorPromise = monitorEvents(fix.httpClient, ['fail'])

            const { body } = await fix.httpClient
                .post('/showtime-creation/showtimes')
                .body({
                    movieId: fix.movie.id,
                    theaterIds: [fix.theater.id],
                    startTimes: [
                        new Date('2013-01-31T12:00'),
                        new Date('2013-01-31T16:00'),
                        new Date('2013-01-31T20:00')
                    ],
                    durationMinutes: 30
                })
                .accepted()

            const { batchId } = body
            expect(batchId).toBeDefined()

            const expected = showtimes.filter((showtime) =>
                [
                    new Date('2013-01-31T12:00').getTime(),
                    new Date('2013-01-31T16:30').getTime(),
                    new Date('2013-01-31T18:30').getTime()
                ].includes(showtime.timeRange.start.getTime())
            )
            const { conflictingShowtimes, ...result } = (await monitorPromise) as any
            expect(result).toEqual({ batchId, status: 'fail' })
            expectEqualUnsorted(conflictingShowtimes, expected)
        })
    })
})
