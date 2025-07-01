import { Type } from 'class-transformer'
import { IsNotEmpty, IsString, ValidateNested } from 'class-validator'
import { Seatmap, TheaterLocation } from '../models'

export class CreateTheaterDto {
    @IsString()
    @IsNotEmpty()
    name: string

    @IsNotEmpty()
    @ValidateNested()
    @Type(() => TheaterLocation)
    location: TheaterLocation

    @IsNotEmpty()
    @ValidateNested()
    @Type(() => Seatmap)
    seatmap: Seatmap
}
