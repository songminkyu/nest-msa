import { CreateStorageFileDto } from 'apps/infrastructures'
import { Type } from 'class-transformer'
import { IsArray, ValidateNested } from 'class-validator'
import { CreateMovieDto } from './create-movie.dto'

export class CreateMovieAndFilesDto {
    @ValidateNested({})
    @Type(() => CreateMovieDto)
    createMovieDto: CreateMovieDto

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateStorageFileDto)
    createFileDtos: CreateStorageFileDto[]
}
