import { IsOptional } from 'class-validator'

export class TheaterInShowtimeFilterDto {
    @IsOptional()
    movieIds?: string[]
}
