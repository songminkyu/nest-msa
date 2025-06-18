import { Seatmap, ShowtimeDto, TheaterDto, TicketDto } from 'apps/cores'
import { DateUtil, pickIds } from 'common'
import { nullObjectId, step } from 'testlib'
import { Fixture } from './booking.fixture'
import { Errors } from './utils'

describe('Booking', () => {
    let fix: Fixture

    beforeEach(async () => {
        const { createFixture } = await import('./booking.fixture')
        fix = await createFixture()
    })

    afterEach(async () => {
        await fix?.teardown()
    })

    /* 성공적인 영화 예매 흐름을 처리할 수 있어야 한다 */
    it('Should handle a successful movie booking flow', async () => {
        let theater: TheaterDto
        let showdate: Date
        let showtime: ShowtimeDto
        let tickets: TicketDto[]

        /* 1. 상영 극장 목록 요청 */
        await step('1. Request list of theaters screening the movie', async () => {
            const latLong = '31.9,131.9'

            const { body: theaters } = await fix.httpClient
                .get(`/booking/movies/${fix.movie.id}/theaters?latLong=${latLong}`)
                .ok()

            expect(theaters).toEqual(
                [
                    { latLong: { latitude: 32.0, longitude: 132.0 } }, // distance = 0.1
                    { latLong: { latitude: 31.0, longitude: 131.0 } }, // distance = 0.9
                    { latLong: { latitude: 33.0, longitude: 133.0 } }, // distance = 1.1
                    { latLong: { latitude: 30.0, longitude: 130.0 } }, // distance = 1.9
                    { latLong: { latitude: 34.0, longitude: 134.0 } } // distance = 2.1
                ].map((item) => expect.objectContaining(item))
            )

            theater = theaters[0]
        })

        /* 2. 상영일 목록 요청 */
        await step('2. Request list of show dates', async () => {
            const { body: showdates } = await fix.httpClient
                .get(`/booking/movies/${fix.movie.id}/theaters/${theater.id}/showdates`)
                .ok()

            expect(showdates).toEqual([
                new Date('2999-01-01'),
                new Date('2999-01-02'),
                new Date('2999-01-03')
            ])

            showdate = showdates[0]
        })

        /* 3. 상영 시간 목록 요청 */
        await step('3. Request list of showtimes', async () => {
            const movieId = fix.movie.id
            const theaterId = theater.id
            const yymmdd = DateUtil.toYMD(showdate)

            const url = `/booking/movies/${movieId}/theaters/${theaterId}/showdates/${yymmdd}/showtimes`
            const { body: showtimes } = await fix.httpClient.get(url).ok(
                expect.arrayContaining(
                    [
                        {
                            movieId,
                            theaterId,
                            startTime: new Date('2999-01-01T12:00'),
                            endTime: new Date('2999-01-01T12:01')
                        },
                        {
                            movieId,
                            theaterId,
                            startTime: new Date('2999-01-01T14:00'),
                            endTime: new Date('2999-01-01T14:01')
                        }
                    ].map((item) => expect.objectContaining(item))
                )
            )

            showtime = showtimes[0]
        })

        /* 4. 구매 가능한 티켓 목록 요청 */
        await step('4. Request list of available tickets', async () => {
            const { body } = await fix.httpClient
                .get(`/booking/showtimes/${showtime.id}/tickets`)
                .ok()

            tickets = body

            const seatCount = Seatmap.getSeatCount(theater.seatmap)
            expect(tickets).toHaveLength(seatCount)
        })

        /* 5. 티켓 선점 */
        await step('5. Hold tickets', async () => {
            const ticketIds = pickIds(tickets.slice(0, 4))

            await fix.httpClient
                .patch(`/booking/showtimes/${showtime.id}/tickets`)
                .headers({ Authorization: `Bearer ${fix.accessToken}` })
                .body({ ticketIds })
                .ok({ success: true })
        })
    })

    describe('GET /booking/showtimes/:id/tickets', () => {
        /* 상영시간이 존재하지 않으면 NOT_FOUND(404)를 반환해야 한다 */
        it('Should return NOT_FOUND(404) if the showtime does not exist', async () => {
            await fix.httpClient
                .get(`/booking/showtimes/${nullObjectId}/tickets`)
                .notFound({ ...Errors.Booking.ShowtimeNotFound, showtimeId: nullObjectId })
        })
    })
})
