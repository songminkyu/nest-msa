import { Injectable } from '@nestjs/common'
import { mapDocToDto } from 'common'
import { PaymentsClient } from 'apps/infrastructures'
import { PurchaseCreateDto, PurchaseDto } from './dtos'
import { PurchaseDocument } from './models'
import { PurchasesRepository } from './purchases.repository'

@Injectable()
export class PurchasesService {
    constructor(
        private repository: PurchasesRepository,
        private paymentsService: PaymentsClient
    ) {}

    async createPurchase(createDto: PurchaseCreateDto) {
        const payment = await this.paymentsService.processPayment({
            customerId: createDto.customerId,
            amount: createDto.totalPrice
        })

        const purchase = await this.repository.createPurchase({
            ...createDto,
            paymentId: payment.id
        })

        return this.toDto(purchase)
    }

    async getPurchases(purchaseIds: string[]) {
        const purchases = await this.repository.getByIds(purchaseIds)

        return this.toDtos(purchases)
    }

    private toDto = (purchase: PurchaseDocument) =>
        mapDocToDto(purchase, PurchaseDto, [
            'id',
            'customerId',
            'paymentId',
            'totalPrice',
            'items',
            'createdAt',
            'updatedAt'
        ])

    private toDtos = (purchases: PurchaseDocument[]) =>
        purchases.map((purchase) => this.toDto(purchase))
}
