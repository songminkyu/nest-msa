import { IsNotEmpty, IsString } from 'class-validator'

export class SearchShowdatesForBookingDto {
    @IsString()
    @IsNotEmpty()
    movieId: string

    @IsString()
    @IsNotEmpty()
    theaterId: string
}
