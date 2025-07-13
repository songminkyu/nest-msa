import { IsOptional } from 'class-validator'
import { PartialDateTimeRange } from 'common'

export class SearchShowtimesDto {
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
