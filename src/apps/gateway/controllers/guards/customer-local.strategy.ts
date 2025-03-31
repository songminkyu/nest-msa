import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { CustomersClient } from 'apps/cores'
import { AuthTokenPayload } from 'common'
import { Strategy } from 'passport-local'

@Injectable()
export class CustomerLocalStrategy extends PassportStrategy(Strategy, 'customer-local') {
    constructor(private customersService: CustomersClient) {
        super({
            usernameField: 'email',
            passwordField: 'password'
        })
    }

    async validate(email: string, password: string): Promise<AuthTokenPayload | null> {
        const userId = await this.customersService.authenticateCustomer(email, password)

        // TODO customerId
        return userId ? { userId, email } : null
    }
}
