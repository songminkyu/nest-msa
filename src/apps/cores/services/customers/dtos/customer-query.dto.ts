import { IsOptional } from 'class-validator'
import { CommonQueryDto } from 'common'

export class CustomerQueryDto extends CommonQueryDto {
    @IsOptional()
    name?: string

    @IsOptional()
    email?: string
}
