import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common'
import { Transform } from 'class-transformer'
import { IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator'

export const PaginationErrors = {
    TakeLimitExceeded: {
        code: 'ERR_PAGINATION_TAKE_LIMIT_EXCEEDED',
        message: "The 'take' parameter exceeds the maximum allowed limit"
    },
    FormatInvalid: {
        code: 'ERR_PAGINATION_ORDERBY_FORMAT_INVALID',
        message: "Invalid orderby format. It should be 'name:direction'"
    },
    DirectionInvalid: {
        code: 'ERR_PAGINATION_ORDERBY_DIRECTION_INVALID',
        message: 'Invalid direction. It should be either "asc" or "desc".'
    }
}

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

export class PaginationOptionDto {
    @IsOptional()
    @IsInt()
    @Min(1)
    take?: number

    @IsOptional()
    @IsInt()
    @Min(0)
    skip?: number

    /**
     * HttpController에서는 'orderby'가 문자열(예: "name:asc")로 전달되고,
     * RpcController에서는 객체({ name, direction })로 전달됩니다.
     */
    @IsOptional()
    @Transform(({ value }) => {
        if (value.direction && value.name) {
            return value
        }

        const parts = value.split(':')

        if (parts.length !== 2) {
            throw new BadRequestException(PaginationErrors.FormatInvalid)
        }

        const [name, direction] = parts

        if (!(direction in OrderDirection)) {
            throw new BadRequestException(PaginationErrors.DirectionInvalid)
        }

        return { name, direction }
    })
    orderby?: OrderOption
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

@Injectable()
export abstract class PaginationPipe implements PipeTransform {
    abstract get takeLimit(): number

    transform(value: any, metadata: ArgumentMetadata) {
        if (metadata.type === 'query') {
            if (value instanceof PaginationOptionDto) {
                if (!value.skip) {
                    value.skip = 0
                }

                if (value.take) {
                    if (this.takeLimit < value.take) {
                        throw new BadRequestException({
                            ...PaginationErrors.TakeLimitExceeded,
                            take: value.take,
                            takeLimit: this.takeLimit
                        })
                    }
                } else {
                    value.take = this.takeLimit
                }
            }
        }

        return value
    }
}
