import { ShowtimeDto, TheaterDto, TicketSalesForShowtimeDto } from 'apps/cores'
import { LatLong } from 'common'
import { ShowtimeForBooking } from './dtos'

export function sortTheatersByDistance(theaters: TheaterDto[], latlong: LatLong) {
    return theaters.sort(
        (a, b) =>
            Math.abs(LatLong.distanceInMeters(a.latlong, latlong)) -
            Math.abs(LatLong.distanceInMeters(b.latlong, latlong))
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
