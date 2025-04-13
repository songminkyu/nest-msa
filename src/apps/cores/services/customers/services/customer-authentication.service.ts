import { Injectable } from '@nestjs/common'
import { compare, hash } from 'bcrypt'
import { InjectJwtAuth, JwtAuthService } from 'common'
import { CustomersRepository } from '../customers.repository'
import { CustomerAuthPayload } from '../dtos'

@Injectable()
export class CustomerAuthenticationService {
    constructor(
        private repository: CustomersRepository,
        @InjectJwtAuth() private jwtAuthService: JwtAuthService
    ) {}

    async generateAuthTokens(payload: CustomerAuthPayload) {
        return this.jwtAuthService.generateAuthTokens(payload)
    }

    async refreshAuthTokens(refreshToken: string) {
        return this.jwtAuthService.refreshAuthTokens(refreshToken)
    }

    async authenticateCustomer(email: string, password: string) {
        const customer = await this.repository.findByEmail(email)

        if (!customer) return null

        const storedPassword = await this.repository.getPassword(customer.id)
        const isValidPassword = await this.validate(password, storedPassword)

        if (isValidPassword) {
            return customer.id
        }

        return null
    }

    async hash(password: string) {
        const saltRounds = 10

        const hashedPassword = await hash(password, saltRounds)
        return hashedPassword
    }

    async validate(plainPassword: string, hashedPassword: string) {
        return compare(plainPassword, hashedPassword)
    }
}
