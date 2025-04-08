import { Seatmap, ShowtimeDto, TheaterDto, TicketDto } from 'apps/cores'
import { DateTimeRange, DateUtil, pickIds } from 'common'
import { step } from 'testlib'
import { Fixture } from './booking.fixture'

/* 영화 예매 흐름 테스트 */
describe('Movie Booking Workflow Tests', () => {
    let fix: Fixture

    beforeEach(async () => {
        const { createFixture } = await import('./booking.fixture')
        fix = await createFixture()
    })

    afterEach(async () => {
        await fix?.teardown()
    })

    it('성공적인 영화 예매 흐름', async () => {
        let theater: TheaterDto
        let showdate: Date
        let showtime: ShowtimeDto
        let tickets: TicketDto[]

        await step('1. 상영 극장 목록 요청', async () => {
            const latlong = '31.9,131.9'

            const { body: theaters } = await fix.httpClient
                .get(`/booking/movies/${fix.movie.id}/theaters?latlong=${latlong}`)
                .ok()

            expect(theaters).toEqual(
                [
                    { latlong: { latitude: 32.0, longitude: 132.0 } }, // distance = 0.1
                    { latlong: { latitude: 31.0, longitude: 131.0 } }, // distance = 0.9
                    { latlong: { latitude: 33.0, longitude: 133.0 } }, // distance = 1.1
                    { latlong: { latitude: 30.0, longitude: 130.0 } }, // distance = 1.9
                    { latlong: { latitude: 34.0, longitude: 134.0 } } // distance = 2.1
                ].map((item) => expect.objectContaining(item))
            )

            theater = theaters[0]
        })

        await step('2. 상영일 목록 요청', async () => {
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

        await step('3. 상영 시간 목록 요청', async () => {
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
                            timeRange: DateTimeRange.create({
                                start: new Date('2999-01-01T12:00'),
                                minutes: 90
                            })
                        },
                        {
                            movieId,
                            theaterId,
                            timeRange: DateTimeRange.create({
                                start: new Date('2999-01-01T14:00'),
                                minutes: 90
                            })
                        }
                    ].map((item) => expect.objectContaining(item))
                )
            )

            showtime = showtimes[0]
        })

        await step('4. 구매 가능한 티켓 목록 요청', async () => {
            const { body } = await fix.httpClient
                .get(`/booking/showtimes/${showtime.id}/tickets`)
                .ok()

            tickets = body

            const seatCount = Seatmap.getSeatCount(theater.seatmap)
            expect(tickets).toHaveLength(seatCount)
        })

        await step('5. 티켓 선점', async () => {
            const ticketIds = pickIds(tickets.slice(0, 4))

            await fix.httpClient
                .patch(`/booking/showtimes/${showtime.id}/tickets`)
                .headers({ Authorization: `Bearer ${fix.accessToken}` })
                .body({ ticketIds })
                .ok({ success: true })
        })
    })
})
