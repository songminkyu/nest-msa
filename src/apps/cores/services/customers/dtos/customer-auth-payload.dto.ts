import { IsEmail, IsString } from 'class-validator'

// TODO Dto가 맞나?
export class CustomerAuthPayloadDto {
    @IsString()
    customerId: string

    @IsEmail()
    email: string
}
