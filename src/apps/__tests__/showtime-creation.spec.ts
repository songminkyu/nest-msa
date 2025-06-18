import { Seatmap, ShowtimeDto } from 'apps/cores'
import { expectEqualUnsorted, nullDate, nullObjectId } from 'testlib'
import { createShowtimes } from './common.fixture'
import { createShowtimeDtos, Fixture, monitorEvents } from './showtime-creation.fixture'

describe('Showtime Creation', () => {
    let fix: Fixture

    beforeEach(async () => {
        const { createFixture } = await import('./showtime-creation.fixture')
        fix = await createFixture()
    })

    afterEach(async () => {
        await fix?.teardown()
    })

    /* 영화 목록 요청 */
    it('Should request the list of movies', async () => {
        const { body } = await fix.httpClient
            .get('/showtime-creation/movies')
            .query({ skip: 0 })
            .ok()
        const { items, ...paginated } = body

        expect(paginated).toEqual({ skip: 0, take: expect.any(Number), total: 1 })
        expect(items).toEqual([fix.movie])
    })

    /* 극장 목록 요청 */
    it('Should request the list of theaters', async () => {
        const { body } = await fix.httpClient
            .get('/showtime-creation/theaters')
            .query({ skip: 0 })
            .ok()
        const { items, ...paginated } = body

        expect(paginated).toEqual({ skip: 0, take: expect.any(Number), total: 1 })
        expect(items).toEqual([fix.theater])
    })

    /* 상영시간 목록 요청 */
    describe('Requesting the list of showtimes', () => {
        let showtimes: ShowtimeDto[]

        beforeEach(async () => {
            const createDtos = createShowtimeDtos({
                startTimes: [
                    new Date('2100-01-01T09:00'),
                    new Date('2100-01-01T11:00'),
                    new Date('2100-01-01T13:00')
                ],
                theaterId: fix.theater.id,
                durationInMinutes: 1
            })

            showtimes = await createShowtimes(fix, createDtos)
        })

        /* 예정된 상영시간 목록을 반환해야 한다 */
        it('Should return the list of scheduled showtimes', async () => {
            const { body } = await fix.httpClient
                .post('/showtime-creation/showtimes/search')
                .body({ theaterIds: [fix.theater.id] })
                .ok()

            expectEqualUnsorted(body, showtimes)
        })
    })

    /* 상영시간 생성 */
    describe('Creating showtimes', () => {
        const createShowtimeBatch = async (
            movieId: string,
            theaterIds: string[],
            startTimes: Date[]
        ) => {
            const { body } = await fix.httpClient
                .post('/showtime-creation/showtimes')
                .body({ movieId, theaterIds, startTimes, durationInMinutes: 1 })
                .accepted()

            return body
        }

        /* 상영시간 생성 요청이 성공해야 한다 */
        it('Should successfully process the showtime creation request', async () => {
            const monitorPromise = monitorEvents(fix.httpClient, ['succeeded'])

            const theaterIds = [fix.theater.id]
            const startTimes = [
                new Date('2100-01-01T09:00'),
                new Date('2100-01-01T11:00'),
                new Date('2100-01-01T13:00')
            ]

            const { transactionId } = await createShowtimeBatch(
                fix.movie.id,
                theaterIds,
                startTimes
            )

            expect(transactionId).toBeDefined()

            const seatCount = Seatmap.getSeatCount(fix.theater.seatmap)
            const createdShowtimeCount = theaterIds.length * startTimes.length
            const createdTicketCount = createdShowtimeCount * seatCount

            await expect(monitorPromise).resolves.toEqual({
                transactionId,
                status: 'succeeded',
                createdShowtimeCount,
                createdTicketCount
            })
        })

        /* movie가 존재하지 않으면 작업 요청이 실패해야 한다 */
        it('Should fail if the specified movie does not exist', async () => {
            const monitorPromise = monitorEvents(fix.httpClient, ['error'])

            const { transactionId } = await createShowtimeBatch(
                nullObjectId,
                [fix.theater.id],
                [nullDate]
            )

            expect(transactionId).toBeDefined()

            await expect(monitorPromise).resolves.toEqual({
                transactionId,
                status: 'error',
                message: 'The requested movie could not be found.'
            })
        })

        /* theater가 존재하지 않으면 작업 요청이 실패해야 한다 */
        it('Should fail if one or more specified theaters do not exist', async () => {
            const monitorPromise = monitorEvents(fix.httpClient, ['error'])

            const { transactionId } = await createShowtimeBatch(
                fix.movie.id,
                [nullObjectId],
                [nullDate]
            )

            expect(transactionId).toBeDefined()

            await expect(monitorPromise).resolves.toEqual({
                transactionId,
                status: 'error',
                message: 'One or more requested theaters could not be found.'
            })
        })
    })

    /* 상영시간 충돌 점검 */
    describe('Checking for showtime conflicts', () => {
        let showtimes: ShowtimeDto[]

        beforeEach(async () => {
            const createDtos = createShowtimeDtos({
                startTimes: [
                    new Date('2013-01-31T12:00'),
                    new Date('2013-01-31T14:00'),
                    new Date('2013-01-31T16:30'),
                    new Date('2013-01-31T18:30')
                ],
                theaterId: fix.theater.id,
                durationInMinutes: 90
            })

            showtimes = await createShowtimes(fix, createDtos)
        })

        /* 상영시간 충돌 시 충돌 정보를 반환해야 한다 */
        it('Should return conflict information when showtimes conflict.', async () => {
            const monitorPromise = monitorEvents(fix.httpClient, ['failed'])

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
                    durationInMinutes: 30
                })
                .accepted()

            const { transactionId } = body
            expect(transactionId).toBeDefined()

            const expected = showtimes.filter((showtime) =>
                [
                    new Date('2013-01-31T12:00').getTime(),
                    new Date('2013-01-31T16:30').getTime(),
                    new Date('2013-01-31T18:30').getTime()
                ].includes(showtime.startTime.getTime())
            )
            const { conflictingShowtimes, ...result } = (await monitorPromise) as any
            expect(result).toEqual({ transactionId, status: 'failed' })
            expectEqualUnsorted(conflictingShowtimes, expected)
        })
    })
})
