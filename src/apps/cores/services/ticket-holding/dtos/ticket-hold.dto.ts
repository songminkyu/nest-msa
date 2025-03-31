import { ArrayNotEmpty, IsArray, IsNotEmpty, IsPositive, IsString } from 'class-validator'

export class TicketHoldDto {
    @IsString()
    @IsNotEmpty()
    customerId: string

    @IsString()
    @IsNotEmpty()
    showtimeId: string

    @IsArray()
    @ArrayNotEmpty()
    @IsString({ each: true })
    ticketIds: string[]

    @IsPositive()
    @IsNotEmpty()
    ttlMs: number
}
