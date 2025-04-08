import { Type } from 'class-transformer'
import { IsDate, IsOptional } from 'class-validator'
import { CommonQueryDto } from 'common'

export class TimeRangeFilter {
    @IsDate()
    @Type(() => Date)
    start?: Date

    @IsDate()
    @Type(() => Date)
    end?: Date
}

export class ShowtimeQueryDto extends CommonQueryDto {
    @IsOptional()
    batchIds?: string[]

    @IsOptional()
    movieIds?: string[]

    @IsOptional()
    theaterIds?: string[]

    @IsOptional()
    startTimeRange?: TimeRangeFilter

    @IsOptional()
    endTimeRange?: TimeRangeFilter
}
