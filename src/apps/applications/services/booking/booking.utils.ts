import { ShowtimeDto, TheaterDto, TicketSalesForShowtimeDto } from 'apps/cores'
import { LatLong } from 'common'
import { ShowtimeForBooking } from './dtos'

export function sortTheatersByDistance(theaters: TheaterDto[], latLong: LatLong) {
    return theaters.sort(
        (a, b) =>
            Math.abs(LatLong.distanceInMeters(a.latLong, latLong)) -
            Math.abs(LatLong.distanceInMeters(b.latLong, latLong))
    )
}

export function generateShowtimesForBooking(
    showtimes: ShowtimeDto[],
    ticketSalesForShowtimes: TicketSalesForShowtimeDto[]
) {
    const ticketSalesByShowtime = new Map(
        ticketSalesForShowtimes.map((status) => [status.showtimeId, status])
    )

    const showtimesForBooking = showtimes.map((showtime) => {
        const { total, sold, available } = ticketSalesByShowtime.get(showtime.id)!

        return { ...showtime, ticketSales: { total, sold, available } }
    })

    return showtimesForBooking as ShowtimeForBooking[]
}
