import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { CustomerAuthPayload, CustomersClient } from 'apps/cores'
import { Strategy } from 'passport-local'

@Injectable()
export class CustomerLocalStrategy extends PassportStrategy(Strategy, 'customer-local') {
    constructor(private customersService: CustomersClient) {
        super({
            usernameField: 'email',
            passwordField: 'password'
        })
    }

    async validate(email: string, password: string): Promise<CustomerAuthPayload | null> {
        const customerId = await this.customersService.authenticateCustomer(email, password)

        return customerId ? { customerId, email } : null
    }
}
