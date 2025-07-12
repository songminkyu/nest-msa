import { IsOptional } from 'class-validator'
import { PaginationDto } from 'common'

export class SearchMoviesPageDto extends PaginationDto {
    @IsOptional()
    title?: string

    @IsOptional()
    genre?: string

    @IsOptional()
    releaseDate?: Date

    @IsOptional()
    plot?: string

    @IsOptional()
    director?: string

    @IsOptional()
    rating?: string
}
