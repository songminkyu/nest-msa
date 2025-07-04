import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common'
import { CommonQueryDto } from './common-query.dto'
import { CommonQueryErrors } from './errors'

@Injectable()
export abstract class CommonQueryPipe implements PipeTransform {
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
                            ...CommonQueryErrors.TakeLimitExceeded,
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
