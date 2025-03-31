import { Controller } from '@nestjs/common'
import { MessagePattern, Payload } from '@nestjs/microservices'
import { Messages } from 'shared'
import { CustomersService } from './customers.service'
import { CustomerAuthPayloadDto, CustomerCreateDto, CustomerQueryDto, CustomerUpdateDto } from './dtos'

@Controller()
export class CustomersController {
    constructor(private service: CustomersService) {}

    @MessagePattern(Messages.Customers.createCustomer)
    async createCustomer(@Payload() createDto: CustomerCreateDto) {
        return this.service.createCustomer(createDto)
    }

    @MessagePattern(Messages.Customers.updateCustomer)
    updateCustomer(
        @Payload('customerId') customerId: string,
        @Payload('updateDto') updateDto: CustomerUpdateDto
    ) {
        return this.service.updateCustomer(customerId, updateDto)
    }

    @MessagePattern(Messages.Customers.getCustomers)
    getCustomers(@Payload() customerIds: string[]) {
        return this.service.getCustomers(customerIds)
    }

    @MessagePattern(Messages.Customers.deleteCustomers)
    deleteCustomers(@Payload() customerIds: string[]) {
        return this.service.deleteCustomers(customerIds)
    }

    @MessagePattern(Messages.Customers.findCustomers)
    findCustomers(@Payload() queryDto: CustomerQueryDto) {
        return this.service.findCustomers(queryDto)
    }

    @MessagePattern(Messages.Customers.login)
    generateAuthTokens(@Payload() payload: CustomerAuthPayloadDto) {
        return this.service.generateAuthTokens(payload)
    }

    @MessagePattern(Messages.Customers.refreshAuthTokens)
    refreshAuthTokens(@Payload() refreshToken: string) {
        return this.service.refreshAuthTokens(refreshToken)
    }

    @MessagePattern(Messages.Customers.authenticateCustomer)
    authenticateCustomer(@Payload('email') email: string, @Payload('password') password: string) {
        return this.service.authenticateCustomer(email, password)
    }
}
