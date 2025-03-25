import { Module } from '@nestjs/common'
import {
    BookingServiceProxy,
    PurchaseProcessServiceProxy,
    RecommendationServiceProxy,
    ShowtimeCreationServiceProxy
} from 'apps/applications'
import {
    CustomersServiceProxy,
    MoviesServiceProxy,
    PurchasesServiceProxy,
    TheatersServiceProxy
} from 'apps/cores'
import { StorageFilesServiceProxy } from 'apps/infrastructures'
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
        StorageFilesServiceProxy,
        MoviesServiceProxy,
        TheatersServiceProxy,
        ShowtimeCreationServiceProxy,
        BookingServiceProxy,
        PurchasesServiceProxy,
        RecommendationServiceProxy,
        PurchaseProcessServiceProxy
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
