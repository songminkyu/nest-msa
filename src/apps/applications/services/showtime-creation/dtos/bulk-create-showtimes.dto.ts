import { Type } from 'class-transformer'
import { ArrayNotEmpty, IsArray, IsDate, IsNotEmpty, IsPositive, IsString } from 'class-validator'

export class BulkCreateShowtimesDto {
    @IsString()
    @IsNotEmpty()
    movieId: string

    @IsArray()
    @ArrayNotEmpty()
    @IsString({ each: true })
    theaterIds: string[]

    @IsPositive()
    @IsNotEmpty()
    durationInMinutes: number

    @IsArray()
    @ArrayNotEmpty()
    @IsDate({ each: true })
    @Type(() => Date)
    startTimes: Date[]
}
