import { IsEnum, IsInt, IsString } from 'class-validator'

export enum OrderDirection {
    asc = 'asc',
    desc = 'desc'
}

export class OrderOption {
    @IsString()
    name: string

    @IsString()
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
