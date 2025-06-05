import { IsNotEmpty, IsPositive, IsString } from 'class-validator'

export class CreatePaymentDto {
    @IsString()
    @IsNotEmpty()
    customerId: string

    @IsPositive()
    @IsNotEmpty()
    amount: number
}
