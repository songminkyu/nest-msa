import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    Patch,
    Post,
    Query,
    Req,
    UseGuards,
    UsePipes
} from '@nestjs/common'
import {
    CreateCustomerDto,
    SearchCustomersDto,
    CustomersClient,
    UpdateCustomerDto
} from 'apps/cores'
import { Assert } from 'common'
import { CustomerJwtAuthGuard, CustomerLocalAuthGuard, Public } from './guards'
import { DefaultCommonQueryPipe } from './pipes'
import { CustomerAuthRequest } from './types'

@Controller('customers')
@UseGuards(CustomerJwtAuthGuard)
export class CustomersController {
    constructor(private customersService: CustomersClient) {}

    @Public()
    @Post()
    async createCustomer(@Body() createDto: CreateCustomerDto) {
        return this.customersService.createCustomer(createDto)
    }

    @Patch(':customerId')
    async updateCustomer(
        @Param('customerId') customerId: string,
        @Body() updateDto: UpdateCustomerDto
    ) {
        return this.customersService.updateCustomer(customerId, updateDto)
    }

    @Get(':customerId')
    async getCustomer(@Param('customerId') customerId: string) {
        const customers = await this.customersService.getCustomers([customerId])
        return customers[0]
    }

    @Delete(':customerId')
    async deleteCustomer(@Param('customerId') customerId: string) {
        return this.customersService.deleteCustomers([customerId])
    }

    @UsePipes(DefaultCommonQueryPipe)
    @Get()
    async searchCustomersPage(@Query() searchDto: SearchCustomersDto) {
        return this.customersService.searchCustomersPage(searchDto)
    }

    @UseGuards(CustomerLocalAuthGuard)
    @HttpCode(HttpStatus.OK)
    @Post('login')
    async login(@Req() req: CustomerAuthRequest) {
        Assert.defined(req.user, 'req.user must be returned in LocalStrategy.validate')

        return this.customersService.generateAuthTokens(req.user)
    }

    @Public()
    @HttpCode(HttpStatus.OK)
    @Post('refresh')
    async refreshToken(@Body('refreshToken') refreshToken: string) {
        return this.customersService.refreshAuthTokens(refreshToken)
    }
}
