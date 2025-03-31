import { Injectable } from '@nestjs/common'
import { ClientProxyService, InjectClientProxy, JwtAuthTokens } from 'common'
import { Messages } from 'shared'
import {
    CustomerAuthPayloadDto,
    CustomerCreateDto,
    CustomerDto,
    CustomerQueryDto,
    CustomerUpdateDto
} from './dtos'

@Injectable()
export class CustomersClient {
    constructor(@InjectClientProxy() private proxy: ClientProxyService) {}

    async createCustomer(createDto: CustomerCreateDto): Promise<CustomerDto> {
        return this.proxy.getJson<CustomerDto>(Messages.Customers.createCustomer, createDto)
    }

    updateCustomer(customerId: string, updateDto: CustomerUpdateDto): Promise<CustomerDto> {
        return this.proxy.getJson(Messages.Customers.updateCustomer, { customerId, updateDto })
    }

    getCustomers(customerIds: string[]): Promise<CustomerDto[]> {
        return this.proxy.getJson(Messages.Customers.getCustomers, customerIds)
    }

    deleteCustomers(customerIds: string[]): Promise<boolean> {
        return this.proxy.getJson(Messages.Customers.deleteCustomers, customerIds)
    }

    findCustomers(queryDto: CustomerQueryDto): Promise<CustomerDto[]> {
        return this.proxy.getJson(Messages.Customers.findCustomers, queryDto)
    }

    generateAuthTokens(payload: CustomerAuthPayloadDto): Promise<JwtAuthTokens> {
        return this.proxy.getJson(Messages.Customers.login, payload)
    }

    refreshAuthTokens(refreshToken: string): Promise<JwtAuthTokens> {
        return this.proxy.getJson(Messages.Customers.refreshAuthTokens, refreshToken)
    }

    authenticateCustomer(email: string, password: string): Promise<string | null> {
        return this.proxy.getJson(Messages.Customers.authenticateCustomer, { email, password })
    }
}
