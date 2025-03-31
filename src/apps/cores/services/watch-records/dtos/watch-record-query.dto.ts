import { IsOptional } from 'class-validator'
import { CommonQueryDto } from 'common'

export class WatchRecordQueryDto extends CommonQueryDto {
    @IsOptional()
    customerId?: string
}
