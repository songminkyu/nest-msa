import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common'
import { CommonQueryDto } from './common-query.dto'
import { PaginationErrors } from './errors'

@Injectable()
export abstract class PaginationPipe implements PipeTransform {
    abstract get takeLimit(): number

    transform(value: any, metadata: ArgumentMetadata) {
        if (metadata.type === 'query') {
            if (value instanceof CommonQueryDto) {
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
