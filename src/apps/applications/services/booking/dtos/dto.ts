import { Type } from 'class-transformer'
import { IsDate, IsNotEmpty, IsString, ValidateNested } from 'class-validator'
import { LatLong } from 'common'

export class FindShowingTheatersDto {
    @IsString()
    @IsNotEmpty()
    movieId: string

    @IsNotEmpty()
    @ValidateNested()
    @Type(() => LatLong)
    latlong: LatLong
}

export class FindShowdatesDto {
    @IsString()
    @IsNotEmpty()
    movieId: string

    @IsString()
    @IsNotEmpty()
    theaterId: string
}

export class FindShowtimesDto {
    @IsString()
    @IsNotEmpty()
    movieId: string

    @IsString()
    @IsNotEmpty()
    theaterId: string

    @IsDate()
    @Type(() => Date)
    showdate: Date
}
