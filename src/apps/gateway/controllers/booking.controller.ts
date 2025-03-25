import { Body, Controller, Get, Param, Patch, Req, UseGuards } from '@nestjs/common'
import { BookingServiceProxy } from 'apps/applications'
import { DateUtil, LatLong, LatLongQuery } from 'common'
import { CustomerJwtAuthGuard } from './guards'
import { AuthRequest } from './types'

@Controller('booking')
export class BookingController {
    constructor(private bookingService: BookingServiceProxy) {}

    @Get('movies/:movieId/theaters')
    async findShowingTheaters(
        @Param('movieId') movieId: string,
        @LatLongQuery('latlong') latlong: LatLong
    ) {
        return this.bookingService.findShowingTheaters({ movieId, latlong })
    }

    @Get('movies/:movieId/theaters/:theaterId/showdates')
    async findShowdates(@Param('movieId') movieId: string, @Param('theaterId') theaterId: string) {
        return this.bookingService.findShowdates({ movieId, theaterId })
    }

    @Get('movies/:movieId/theaters/:theaterId/showdates/:showdate/showtimes')
    async findShowtimes(
        @Param('movieId') movieId: string,
        @Param('theaterId') theaterId: string,
        @Param('showdate') showdate: string
    ) {
        return this.bookingService.findShowtimes({
            movieId,
            theaterId,
            showdate: DateUtil.fromYMD(showdate)
        })
    }

    @Get('showtimes/:showtimeId/tickets')
    async getTicketsForShowtime(@Param('showtimeId') showtimeId: string) {
        return this.bookingService.getAvailableTickets(showtimeId)
    }

    @UseGuards(CustomerJwtAuthGuard)
    @Patch('showtimes/:showtimeId/tickets')
    async holdTickets(
        @Param('showtimeId') showtimeId: string,
        @Body('ticketIds') ticketIds: string[],
        @Req() req: AuthRequest
    ) {
        const customerId = req.user.userId
        return this.bookingService.holdTickets({ customerId, showtimeId, ticketIds })
    }
}
