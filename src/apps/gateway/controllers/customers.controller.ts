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
    CustomerCreateDto,
    CustomerQueryDto,
    CustomersServiceProxy,
    CustomerUpdateDto
} from 'apps/cores'
import { Assert } from 'common'
import { CustomerJwtAuthGuard, CustomerLocalAuthGuard, Public } from './guards'
import { DefaultPaginationPipe } from './pipes'
import { AuthRequest } from './types'

@Controller('customers')
@UseGuards(CustomerJwtAuthGuard)
export class CustomersController {
    constructor(private customersService: CustomersServiceProxy) {}

    @Public()
    @Post()
    createCustomer(@Body() createDto: CustomerCreateDto) {
        return this.customersService.createCustomer(createDto)
    }

    @Patch(':customerId')
    updateCustomer(@Param('customerId') customerId: string, @Body() updateDto: CustomerUpdateDto) {
        return this.customersService.updateCustomer(customerId, updateDto)
    }

    @Get(':customerId')
    getCustomer(@Param('customerId') customerId: string) {
        return this.customersService.getCustomer(customerId)
    }

    @Delete(':customerId')
    deleteCustomer(@Param('customerId') customerId: string) {
        return this.customersService.deleteCustomer(customerId)
    }

    @UsePipes(DefaultPaginationPipe)
    @Get()
    findCustomers(@Query() queryDto: CustomerQueryDto) {
        return this.customersService.findCustomers(queryDto)
    }

    @UseGuards(CustomerLocalAuthGuard)
    @HttpCode(HttpStatus.OK)
    @Post('login')
    login(@Req() req: AuthRequest) {
        Assert.defined(req.user, 'req.user must be returned in LocalStrategy.validate')

        return this.customersService.login(req.user.userId, req.user.email)
    }

    @Public()
    @HttpCode(HttpStatus.OK)
    @Post('refresh')
    refreshToken(@Body('refreshToken') refreshToken: string) {
        return this.customersService.refreshAuthTokens(refreshToken)
    }
}
