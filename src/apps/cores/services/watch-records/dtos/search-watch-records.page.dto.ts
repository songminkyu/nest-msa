import { IsOptional } from 'class-validator'
import { PaginationDto } from 'common'

export class SearchWatchRecordsPageDto extends PaginationDto {
    @IsOptional()
    customerId?: string
}
