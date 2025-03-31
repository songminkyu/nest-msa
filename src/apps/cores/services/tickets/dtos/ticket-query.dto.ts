import { IsOptional } from 'class-validator'
import { CommonQueryDto } from 'common'

export class TicketQueryDto extends CommonQueryDto {
    @IsOptional()
    batchIds?: string[]

    @IsOptional()
    movieIds?: string[]

    @IsOptional()
    showtimeIds?: string[]

    @IsOptional()
    theaterIds?: string[]
}
