import { Injectable } from '@nestjs/common'
import { ClientProxyService, InjectClientProxy } from 'common'
import { Messages } from 'shared'
import { PaymentCreateDto, PaymentDto } from './dtos'

@Injectable()
export class PaymentsClient {
    constructor(@InjectClientProxy() private proxy: ClientProxyService) {}

    processPayment(createDto: PaymentCreateDto): Promise<PaymentDto> {
        return this.proxy.getJson(Messages.Payments.processPayment, createDto)
    }
}
