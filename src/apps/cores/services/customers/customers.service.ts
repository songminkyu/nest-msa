import { ConflictException, Injectable } from '@nestjs/common'
import { mapDocToDto } from 'common'
import { CustomersRepository } from './customers.repository'
import {
    CustomerAuthPayload,
    CustomerCreateDto,
    CustomerDto,
    CustomerQueryDto,
    CustomerUpdateDto
} from './dtos'
import { CustomerErrors } from './errors'
import { CustomerDocument } from './models'
import { CustomerAuthenticationService } from './services'

/**
 * login, refreshAuthTokens는 단순히 CustomerAuthenticationService의 메소드를 재호출 하고 있어서 안티 패턴으로 보인다.
 * 그러나 더 중요한 원칙은 외부에 노출되는 모든 기능은 CustomersService을 통해서 이뤄져야 한다는 것이다.
 * 따라서 CustomersController는 CustomersService만 참조해야 하고 CustomerAuthenticationService를 직접 호출하면 안 된다.
 */
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

    async getCustomers(customerIds: string[]) {
        const customers = await this.repository.getByIds(customerIds)
        return this.toDtos(customers)
    }

    async deleteCustomers(customerIds: string[]) {
        await this.repository.deleteByIds(customerIds)
        return true
    }

    async findCustomers(queryDto: CustomerQueryDto) {
        const { items, ...paginated } = await this.repository.findCustomers(queryDto)
        return { ...paginated, items: this.toDtos(items) }
    }

    async generateAuthTokens(payload: CustomerAuthPayload) {
        return this.authenticationService.generateAuthTokens(payload)
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
