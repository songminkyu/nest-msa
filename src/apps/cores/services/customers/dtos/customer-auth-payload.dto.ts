import { IsEmail, IsString } from 'class-validator'

export class CustomerAuthPayloadDto {
    @IsString()
    customerId: string

    @IsEmail()
    email: string
}
