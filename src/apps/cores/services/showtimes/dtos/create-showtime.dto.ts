import { Type } from 'class-transformer'
import { IsNotEmpty, IsString, ValidateNested } from 'class-validator'
import { DateTimeRange } from 'common'

export class CreateShowtimeDto {
    @IsString()
    @IsNotEmpty()
    batchId: string

    @IsString()
    @IsNotEmpty()
    movieId: string

    @IsString()
    @IsNotEmpty()
    theaterId: string

    @IsNotEmpty()
    @ValidateNested()
    @Type(() => DateTimeRange)
    timeRange: DateTimeRange
}
