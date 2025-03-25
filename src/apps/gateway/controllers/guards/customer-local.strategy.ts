import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { CustomersProxy } from 'apps/cores'
import { AuthTokenPayload } from 'common'
import { Strategy } from 'passport-local'

@Injectable()
export class CustomerLocalStrategy extends PassportStrategy(Strategy, 'customer-local') {
    constructor(private customerService: CustomersProxy) {
        super({
            usernameField: 'email',
            passwordField: 'password'
        })
    }

    async validate(email: string, password: string): Promise<AuthTokenPayload | null> {
        const userId = await this.customerService.authenticateCustomer(email, password)

        return userId ? { userId, email } : null
    }
}
