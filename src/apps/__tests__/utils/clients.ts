import {
    ShowtimeCreationClient,
    BookingClient,
    RecommendationClient,
    PurchaseProcessClient,
    BookingService,
    PurchaseProcessService,
    RecommendationService,
    ShowtimeCreationService
} from 'apps/applications'
import {
    CustomersClient,
    MoviesClient,
    TheatersClient,
    PurchasesClient,
    TicketHoldingClient,
    TicketsClient,
    CustomersService,
    MoviesService,
    PurchasesService,
    TheatersService,
    TicketHoldingService,
    TicketsService
} from 'apps/cores'
import { StorageFilesClient, StorageFilesService } from 'apps/infrastructures'
import { HttpTestContext, TestContext } from 'testlib'

export class AllProviders {
    customersClient: CustomersClient
    storageFilesClient: StorageFilesClient
    moviesClient: MoviesClient
    theatersClient: TheatersClient
    showtimeCreationClient: ShowtimeCreationClient
    bookingClient: BookingClient
    purchasesClient: PurchasesClient
    recommendationClient: RecommendationClient
    purchaseProcessClient: PurchaseProcessClient
    ticketHoldingClient: TicketHoldingClient
    ticketsClient: TicketsClient
    bookingService: BookingService
    purchaseProcessService: PurchaseProcessService
    recommendationService: RecommendationService
    showtimeCreationService: ShowtimeCreationService
    customersService: CustomersService
    moviesService: MoviesService
    purchasesService: PurchasesService
    theatersService: TheatersService
    ticketHoldingService: TicketHoldingService
    ticketsService: TicketsService
    storageFilesService: StorageFilesService
}

export async function getProviders(
    gatewayContext: HttpTestContext,
    appsContext: TestContext,
    coresContext: TestContext,
    infrasContext: TestContext
) {
    const { module: gatewayModule } = gatewayContext
    const customersClient = gatewayModule.get(CustomersClient)
    const storageFilesClient = gatewayModule.get(StorageFilesClient)
    const moviesClient = gatewayModule.get(MoviesClient)
    const theatersClient = gatewayModule.get(TheatersClient)
    const showtimeCreationClient = gatewayModule.get(ShowtimeCreationClient)
    const bookingClient = gatewayModule.get(BookingClient)
    const purchasesClient = gatewayModule.get(PurchasesClient)
    const recommendationClient = gatewayModule.get(RecommendationClient)
    const purchaseProcessClient = gatewayModule.get(PurchaseProcessClient)

    const { module: appsModule } = appsContext
    const ticketHoldingClient = appsModule.get(TicketHoldingClient)
    const ticketsClient = appsModule.get(TicketsClient)
    const bookingService = appsModule.get(BookingService)
    const purchaseProcessService = appsModule.get(PurchaseProcessService)
    const recommendationService = appsModule.get(RecommendationService)
    const showtimeCreationService = appsModule.get(ShowtimeCreationService)

    const { module: coresModule } = coresContext
    const customersService = coresModule.get(CustomersService)
    const moviesService = coresModule.get(MoviesService)
    const purchasesService = coresModule.get(PurchasesService)
    const theatersService = coresModule.get(TheatersService)
    const ticketHoldingService = coresModule.get(TicketHoldingService)
    const ticketsService = coresModule.get(TicketsService)

    const { module: infrasModule } = infrasContext
    const storageFilesService = infrasModule.get(StorageFilesService)

    return {
        customersClient,
        storageFilesClient,
        moviesClient,
        theatersClient,
        showtimeCreationClient,
        bookingClient,
        purchasesClient,
        recommendationClient,
        purchaseProcessClient,
        ticketHoldingClient,
        ticketsClient,
        bookingService,
        purchaseProcessService,
        recommendationService,
        showtimeCreationService,
        customersService,
        moviesService,
        purchasesService,
        theatersService,
        ticketHoldingService,
        ticketsService,
        storageFilesService
    }
}
