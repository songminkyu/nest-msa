import { IsOptional } from 'class-validator'
import { CommonQueryDto } from 'common'

export class SearchTheatersDto extends CommonQueryDto {
    @IsOptional()
    name?: string
}
