import { IsOptional } from 'class-validator'
import { PaginationDto, PartialDateTimeRange } from 'common'

export class SearchShowtimesPageDto extends PaginationDto {
    @IsOptional()
    transactionIds?: string[]

    @IsOptional()
    movieIds?: string[]

    @IsOptional()
    theaterIds?: string[]

    @IsOptional()
    startTimeRange?: PartialDateTimeRange

    @IsOptional()
    endTimeRange?: PartialDateTimeRange
}
