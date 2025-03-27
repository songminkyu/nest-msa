import { Injectable } from '@nestjs/common'
import { ClientProxyService, InjectClientProxy } from 'common'
import { Messages } from 'shared'
import { PaymentCreateDto, PaymentDto } from './dtos'

@Injectable()
export class PaymentsClient {
    constructor(@InjectClientProxy() private service: ClientProxyService) {}

    processPayment(createDto: PaymentCreateDto): Promise<PaymentDto> {
        return this.service.getJson(Messages.Payments.processPayment, createDto)
    }
}
