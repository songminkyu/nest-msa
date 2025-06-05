import { IsOptional } from 'class-validator'
import { CommonQueryDto } from 'common'

export class SearchWatchRecordsDto extends CommonQueryDto {
    @IsOptional()
    customerId?: string
}
