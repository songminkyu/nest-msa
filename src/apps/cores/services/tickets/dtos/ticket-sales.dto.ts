export class TicketSalesDto {
    total: number
    sold: number
    available: number
}

/*
Considered using ShowtimeTicketSalesDto instead of TicketSalesForShowtimeDto,
but chose TicketSalesForShowtimeDto because it's more favorable when expressing the plural form.
Plural: ticketSalesForShowtimes vs showtimeTicketSaleses

TicketSalesForShowtimeDto 대신 ShowtimeTicketSalesDto를 고려했으나
복수형을 표현할 때 TicketSalesForShowtimeDto가 유리해서 선택함
복수형: ticketSalesForShowtimes vs showtimeTicketSaleses
*/
export class TicketSalesForShowtimeDto extends TicketSalesDto {
    showtimeId: string
}
