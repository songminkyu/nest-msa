import { IsOptional } from 'class-validator'
import { CommonQueryDto } from 'common'

export class TheaterQueryDto extends CommonQueryDto {
    @IsOptional()
    name?: string
}
