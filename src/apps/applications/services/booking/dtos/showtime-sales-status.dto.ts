import { ShowtimeDto, TicketSalesDto } from 'apps/cores'

export class ShowtimeWithTicketSalesDto extends ShowtimeDto {
    ticketSales: TicketSalesDto
}
