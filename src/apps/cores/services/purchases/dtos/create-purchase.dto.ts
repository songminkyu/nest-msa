import { Type } from 'class-transformer'
import { IsArray, IsNotEmpty, IsPositive, IsString, ValidateNested } from 'class-validator'
import { PurchaseItemDto } from './purchase.dto'

export class CreatePurchaseDto {
    @IsString()
    @IsNotEmpty()
    customerId: string

    @IsPositive()
    @IsNotEmpty()
    totalPrice: number

    @IsArray()
    @IsNotEmpty()
    @ValidateNested({ each: true })
    @Type(() => PurchaseItemDto)
    purchaseItems: PurchaseItemDto[]
}
