import { IsOptional } from 'class-validator'

export class SearchTicketsDto {
    @IsOptional()
    transactionIds?: string[]

    @IsOptional()
    movieIds?: string[]

    @IsOptional()
    showtimeIds?: string[]

    @IsOptional()
    theaterIds?: string[]
}
