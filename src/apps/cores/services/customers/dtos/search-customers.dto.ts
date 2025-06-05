import { IsOptional, IsString } from 'class-validator'
import { CommonQueryDto } from 'common'

export class SearchCustomersDto extends CommonQueryDto {
    @IsOptional()
    @IsString()
    name?: string

    @IsOptional()
    @IsString()
    email?: string
}
