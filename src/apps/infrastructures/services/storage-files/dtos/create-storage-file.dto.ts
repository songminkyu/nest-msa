import { IsInt, IsNotEmpty, IsString } from 'class-validator'

export class CreateStorageFileDto {
    @IsString()
    @IsNotEmpty()
    originalName: string

    @IsString()
    @IsNotEmpty()
    mimeType: string

    @IsInt()
    size: number

    @IsString()
    @IsNotEmpty()
    path: string
}
