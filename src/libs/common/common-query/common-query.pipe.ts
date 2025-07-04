import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common'
import { CommonQueryDto } from './common-query.dto'
import { CommonQueryErrors } from './errors'

@Injectable()
export abstract class CommonQueryPipe implements PipeTransform {
    abstract get maxTake(): number

    transform(value: any, metadata: ArgumentMetadata) {
        if (metadata.type === 'query') {
            if (value instanceof CommonQueryDto) {
                if (value.take) {
                    if (this.maxTake < value.take) {
                        throw new BadRequestException({
                            ...CommonQueryErrors.MaxTakeExceeded,
                            take: value.take,
                            maxTake: this.maxTake
                        })
                    }
                } else {
                    value.take = this.maxTake
                }
            }
        }

        return value
    }
}
