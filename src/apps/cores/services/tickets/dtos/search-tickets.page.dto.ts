import { IsOptional } from 'class-validator'
import { PaginationDto } from 'common'

export class SearchTicketsPageDto extends PaginationDto {
    @IsOptional()
    transactionIds?: string[]

    @IsOptional()
    movieIds?: string[]

    @IsOptional()
    showtimeIds?: string[]

    @IsOptional()
    theaterIds?: string[]
}
