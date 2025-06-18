import { Type } from 'class-transformer'
import { IsNotEmpty, IsString, ValidateNested } from 'class-validator'
import { LatLong } from 'common'
import { Seatmap } from '../models'

export class CreateTheaterDto {
    @IsString()
    @IsNotEmpty()
    name: string

    @IsNotEmpty()
    @ValidateNested()
    @Type(() => LatLong)
    latLong: LatLong

    @IsNotEmpty()
    @ValidateNested()
    @Type(() => Seatmap)
    seatmap: Seatmap
}
