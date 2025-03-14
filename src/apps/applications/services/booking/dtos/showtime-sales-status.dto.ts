import { ShowtimeDto, TicketSalesStatusDto } from 'apps/cores'

export class ShowtimeSalesStatusDto extends ShowtimeDto {
    salesStatus: TicketSalesStatusDto
}
