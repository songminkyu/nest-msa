import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { MongooseRepository, objectId, QueryBuilder, QueryBuilderOptions } from 'common'
import { Model } from 'mongoose'
import { CustomerCreateDto, CustomerQueryDto, CustomerUpdateDto } from './dtos'
import { CustomerErrors } from './errors'
import { Customer } from './models'

@Injectable()
export class CustomersRepository extends MongooseRepository<Customer> {
    constructor(@InjectModel(Customer.name) model: Model<Customer>) {
        super(model)
    }

    async createCustomer(createDto: CustomerCreateDto) {
        const customer = this.newDocument()
        customer.name = createDto.name
        customer.email = createDto.email
        customer.birthdate = createDto.birthdate
        customer.password = createDto.password

        return customer.save()
    }

    async updateCustomer(customerId: string, updateDto: CustomerUpdateDto) {
        const customer = await this.getById(customerId)
        if (updateDto.name) customer.name = updateDto.name
        if (updateDto.email) customer.email = updateDto.email
        if (updateDto.birthdate) customer.birthdate = updateDto.birthdate

        return customer.save()
    }

    async findCustomers(queryDto: CustomerQueryDto) {
        const { take, skip, orderby } = queryDto

        const paginated = await this.findWithPagination({
            callback: (helpers) => {
                const query = this.buildQuery(queryDto, { allowEmpty: true })

                helpers.setQuery(query)
            },
            pagination: { take, skip, orderby }
        })

        return paginated
    }

    async findByEmail(email: string) {
        return this.model.findOne({ email: { $eq: email } })
    }

    async getPassword(customerId: string) {
        const customer = await this.model.findById(objectId(customerId)).select('+password').exec()

        if (!customer) {
            throw new NotFoundException({ ...CustomerErrors.NotFound, customerId })
        }

        return customer.password
    }

    private buildQuery(queryDto: CustomerQueryDto, options: QueryBuilderOptions) {
        const { name, email } = queryDto

        const builder = new QueryBuilder<Customer>()
        builder.addRegex('name', name)
        builder.addRegex('email', email)

        const query = builder.build(options)
        return query
    }
}
