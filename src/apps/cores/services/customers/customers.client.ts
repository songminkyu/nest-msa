import { Injectable } from '@nestjs/common'
import { ClientProxyService, DeleteResult, InjectClientProxy, JwtAuthTokens } from 'common'
import { Messages } from 'shared'
import {
    CustomerAuthPayload,
    CreateCustomerDto,
    CustomerDto,
    SearchCustomersDto,
    UpdateCustomerDto
} from './dtos'

@Injectable()
export class CustomersClient {
    constructor(@InjectClientProxy() private proxy: ClientProxyService) {}

    async createCustomer(createDto: CreateCustomerDto): Promise<CustomerDto> {
        return this.proxy.getJson<CustomerDto>(Messages.Customers.createCustomer, createDto)
    }

    updateCustomer(customerId: string, updateDto: UpdateCustomerDto): Promise<CustomerDto> {
        return this.proxy.getJson(Messages.Customers.updateCustomer, { customerId, updateDto })
    }

    getCustomers(customerIds: string[]): Promise<CustomerDto[]> {
        return this.proxy.getJson(Messages.Customers.getCustomers, customerIds)
    }

    deleteCustomers(customerIds: string[]): Promise<DeleteResult> {
        return this.proxy.getJson(Messages.Customers.deleteCustomers, customerIds)
    }

    searchCustomersPage(queryDto: SearchCustomersDto): Promise<CustomerDto[]> {
        return this.proxy.getJson(Messages.Customers.searchCustomersPage, queryDto)
    }

    generateAuthTokens(payload: CustomerAuthPayload): Promise<JwtAuthTokens> {
        return this.proxy.getJson(Messages.Customers.login, payload)
    }

    refreshAuthTokens(refreshToken: string): Promise<JwtAuthTokens> {
        return this.proxy.getJson(Messages.Customers.refreshAuthTokens, refreshToken)
    }

    authenticateCustomer(email: string, password: string): Promise<string | null> {
        return this.proxy.getJson(Messages.Customers.authenticateCustomer, { email, password })
    }
}
