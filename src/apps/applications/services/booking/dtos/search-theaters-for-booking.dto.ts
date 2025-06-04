import { Type } from 'class-transformer'
import { IsNotEmpty, IsString, ValidateNested } from 'class-validator'
import { LatLong } from 'common'

export class SearchTheatersForBookingDto {
    @IsString()
    @IsNotEmpty()
    movieId: string

    @IsNotEmpty()
    @ValidateNested()
    @Type(() => LatLong)
    latlong: LatLong
}
