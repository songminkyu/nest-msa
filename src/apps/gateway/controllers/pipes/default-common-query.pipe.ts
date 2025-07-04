import { Injectable } from '@nestjs/common'
import { CommonQueryPipe } from 'common'
import { AppConfigService } from 'shared'

@Injectable()
export class DefaultCommonQueryPipe extends CommonQueryPipe {
    constructor(protected config: AppConfigService) {
        super()
    }

    get takeLimit(): number {
        return this.config.http.paginationDefaultSize
    }
}
