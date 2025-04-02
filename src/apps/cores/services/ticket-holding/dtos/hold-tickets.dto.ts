import { ArrayNotEmpty, IsArray, IsNotEmpty, IsString } from 'class-validator'

export class HoldTicketsDto {
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
}
