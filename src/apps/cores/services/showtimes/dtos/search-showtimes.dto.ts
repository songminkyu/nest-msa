import { IsOptional } from 'class-validator'
import { CommonQueryDto, PartialDateTimeRange } from 'common'

export class SearchShowtimesDto extends CommonQueryDto {
    @IsOptional()
    batchIds?: string[]

    @IsOptional()
    movieIds?: string[]

    @IsOptional()
    theaterIds?: string[]

    @IsOptional()
    startTimeRange?: PartialDateTimeRange

    @IsOptional()
    endTimeRange?: PartialDateTimeRange
}
