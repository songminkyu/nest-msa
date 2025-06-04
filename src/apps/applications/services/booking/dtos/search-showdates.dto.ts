import { IsNotEmpty, IsString } from 'class-validator'

export class SearchShowdatesDto {
    @IsString()
    @IsNotEmpty()
    movieId: string

    @IsString()
    @IsNotEmpty()
    theaterId: string
}
