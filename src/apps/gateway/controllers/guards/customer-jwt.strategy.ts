import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { CustomerAuthPayload } from 'apps/cores'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { AppConfigService } from 'shared'

@Injectable()
export class CustomerJwtStrategy extends PassportStrategy(Strategy, 'customer-jwt') {
    constructor(config: AppConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: config.auth.accessSecret
        })
    }

    validate(payload: CustomerAuthPayload): CustomerAuthPayload | null {
        // TODO 주석에서 한글만 있는거 찾아라
        // 한 줄은 //으로 하고 두 줄은 /**으로 해라 /*은 정렬 안 된다.
        /**
         * 아래처럼 중간에서 제어할 수 있다
         * const exists = await this.service.customersExist([payload.customerId])
         * return exists ? payload : null
         */
        return payload
    }
}
