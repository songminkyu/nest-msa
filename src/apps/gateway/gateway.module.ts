import { Module } from '@nestjs/common'
import {
    BookingServiceProxy,
    PurchaseProcessProxy,
    RecommendationServiceProxy,
    ShowtimeCreationProxy
} from 'apps/applications'
import { CustomersServiceProxy, MoviesServiceProxy, PurchasesProxy, TheatersProxy } from 'apps/cores'
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
        MoviesServiceProxy,
        TheatersProxy,
        ShowtimeCreationProxy,
        BookingServiceProxy,
        PurchasesProxy,
        RecommendationServiceProxy,
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
