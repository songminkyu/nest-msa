import { Module } from '@nestjs/common'
import {
    BookingProxy,
    PurchaseProcessProxy,
    RecommendationProxy,
    ShowtimeCreationProxy
} from 'apps/applications'
import { CustomersProxy, MoviesProxy, PurchasesProxy, TheatersProxy } from 'apps/cores'
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
import { HealthModule, MulterConfigModule, PipesModule } from './modules'

@Module({
    imports: [CommonModule, HealthModule, PipesModule, MulterConfigModule],
    providers: [
        CustomerLocalStrategy,
        CustomerJwtStrategy,
        CustomersProxy,
        StorageFilesProxy,
        MoviesProxy,
        TheatersProxy,
        ShowtimeCreationProxy,
        BookingProxy,
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
