import { IsEnum, IsInt, IsString } from 'class-validator'

export enum OrderDirection {
    Asc = 'asc',
    Desc = 'desc'
}

export class OrderOption {
    @IsString()
    name: string

    @IsEnum(OrderDirection)
    direction: OrderDirection
}

export class PaginationResult<E> {
    @IsInt()
    skip: number

    @IsInt()
    take: number

    @IsInt()
    total: number

    items: E[]
}
