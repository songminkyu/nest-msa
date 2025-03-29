import { ConflictException, Injectable } from '@nestjs/common'
import { mapDocToDto } from 'common'
import { CustomersRepository } from './customers.repository'
import { CustomerCreateDto, CustomerDto, CustomerQueryDto, CustomerUpdateDto } from './dtos'
import { CustomerErrors } from './errors'
import { CustomerDocument } from './models'
import { CustomerAuthenticationService } from './services'

@Injectable()
export class CustomersService {
    constructor(
        private repository: CustomersRepository,
        private authenticationService: CustomerAuthenticationService
    ) {}

    async createCustomer(createDto: CustomerCreateDto) {
        const existingCustomer = await this.repository.findByEmail(createDto.email)

        if (existingCustomer) {
            throw new ConflictException({
                ...CustomerErrors.emailAlreadyExists,
                email: createDto.email
            })
        }

        const password = await this.authenticationService.hash(createDto.password)
        const newCustomer = await this.repository.createCustomer({ ...createDto, password })

        return this.toDto(newCustomer)
    }

    async updateCustomer(customerId: string, updateDto: CustomerUpdateDto) {
        const customer = await this.repository.updateCustomer(customerId, updateDto)
        return this.toDto(customer)
    }

    async getCustomer(customerId: string) {
        const customer = await this.repository.getById(customerId)
        return this.toDto(customer)
    }

    async deleteCustomer(customerId: string) {
        await this.repository.deleteById(customerId)
        return true
    }

    async findCustomers(queryDto: CustomerQueryDto) {
        const { items, ...paginated } = await this.repository.findCustomers(queryDto)
        return { ...paginated, items: this.toDtos(items) }
    }

    async login(userId: string, email: string) {
        return this.authenticationService.login(userId, email)
    }

    async refreshAuthTokens(refreshToken: string) {
        return this.authenticationService.refreshAuthTokens(refreshToken)
    }

    async authenticateCustomer(email: string, password: string) {
        return this.authenticationService.authenticateCustomer(email, password)
    }

    private toDto = (customer: CustomerDocument) =>
        mapDocToDto(customer, CustomerDto, ['id', 'name', 'email', 'birthdate'])

    private toDtos = (customers: CustomerDocument[]) =>
        customers.map((customer) => this.toDto(customer))
}
