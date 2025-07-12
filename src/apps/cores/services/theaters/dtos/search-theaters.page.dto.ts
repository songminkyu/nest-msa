import { IsOptional } from 'class-validator'
import { PaginationDto } from 'common'

export class SearchTheatersPageDto extends PaginationDto {
    @IsOptional()
    name?: string
}
