import { Module } from '@nestjs/common'
import {
    BookingServiceProxy,
    PurchaseProcessProxy,
    RecommendationProxy,
    ShowtimeCreationProxy
} from 'apps/applications'
import { CustomersServiceProxy, MoviesProxy, PurchasesProxy, TheatersProxy } from 'apps/cores'
import { StorageFilesProxy } from 'apps/infrastructures'
import { CommonModule } from 'shared'
import {
    BookingController,
    CustomerJwtStrategy,
    CustomerLocalStrategy,
    CustomersController,
    MoviesController,
    PurchasesController,
    ShowtimeCreationController,
    StorageFilesController,
    TheatersController
} from './controllers'
import { HealthModule, MulterConfigModule } from './modules'

@Module({
    imports: [CommonModule, HealthModule, MulterConfigModule],
    providers: [
        CustomerLocalStrategy,
        CustomerJwtStrategy,
        CustomersServiceProxy,
        StorageFilesProxy,
        MoviesProxy,
        TheatersProxy,
        ShowtimeCreationProxy,
        BookingServiceProxy,
        PurchasesProxy,
        RecommendationProxy,
        PurchaseProcessProxy
    ],
    controllers: [
        CustomersController,
        StorageFilesController,
        MoviesController,
        TheatersController,
        ShowtimeCreationController,
        BookingController,
        PurchasesController
    ]
})
export class GatewayModule {}
