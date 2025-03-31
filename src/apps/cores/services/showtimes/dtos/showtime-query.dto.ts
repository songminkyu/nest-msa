import { IsOptional } from 'class-validator'
import { CommonQueryDto, DateRange } from 'common'

export class ShowtimeQueryDto extends CommonQueryDto {
    @IsOptional()
    batchIds?: string[]

    @IsOptional()
    movieIds?: string[]

    @IsOptional()
    theaterIds?: string[]

    @IsOptional()
    startTimeRange?: DateRange

    @IsOptional()
    endTimeRange?: DateRange
}
