import { IsOptional } from 'class-validator'
import { CommonQueryDto, PartialDateTimeRange } from 'common'

export class SearchShowtimesDto extends CommonQueryDto {
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
