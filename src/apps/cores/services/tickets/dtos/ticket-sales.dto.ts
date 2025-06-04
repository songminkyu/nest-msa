export class TicketSalesDto {
    total: number
    sold: number
    available: number
}

export class TicketSalesForShowtimeDto extends TicketSalesDto {
    showtimeId: string
}
