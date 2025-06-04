import { ShowtimeDto, TicketSalesDto } from 'apps/cores'

export class ShowtimeForBooking extends ShowtimeDto {
    ticketSales: TicketSalesDto
}
