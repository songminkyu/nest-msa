import { IsOptional } from 'class-validator'
import { CommonQueryDto } from 'common'

export class SearchMoviesDto extends CommonQueryDto {
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
