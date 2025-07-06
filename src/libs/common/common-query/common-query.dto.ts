import { BadRequestException } from '@nestjs/common'
import { Transform } from 'class-transformer'
import { IsInt, IsOptional, Min } from 'class-validator'
import { CommonQueryErrors } from './errors'
import { OrderDirection, OrderBy } from './types'

export class CommonQueryDto {
    @IsOptional()
    @IsInt()
    @Min(1)
    take?: number

    @IsOptional()
    @IsInt()
    @Min(0)
    skip?: number

    /**
     * In HttpController, 'orderby' is passed as a string (e.g., "name:asc"),
     * in RpcController, it's passed as an object ({ name, direction }).
     *
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
            throw new BadRequestException(CommonQueryErrors.FormatInvalid)
        }

        const [name, direction] = parts

        if (!Object.values(OrderDirection).includes(direction)) {
            throw new BadRequestException(CommonQueryErrors.DirectionInvalid)
        }

        return { name, direction }
    })
    orderby?: OrderBy
}
