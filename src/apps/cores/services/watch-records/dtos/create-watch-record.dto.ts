import { IsDate, IsNotEmpty, IsString } from 'class-validator'

export class CreateWatchRecordDto {
    @IsString()
    @IsNotEmpty()
    customerId: string

    @IsString()
    @IsNotEmpty()
    movieId: string

    @IsString()
    @IsNotEmpty()
    purchaseId: string

    @IsDate()
    watchDate: Date
}
