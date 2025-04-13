import { IsOptional, IsString } from 'class-validator'
import { CommonQueryDto } from 'common'

export class CustomerQueryDto extends CommonQueryDto {
    @IsOptional()
    @IsString()
    name?: string

    @IsOptional()
    @IsString()
    email?: string
}
