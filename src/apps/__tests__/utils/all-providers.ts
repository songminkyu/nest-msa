import {
    BookingClient,
    BookingService,
    PurchaseProcessClient,
    PurchaseProcessService,
    RecommendationClient,
    RecommendationService,
    ShowtimeCreationClient,
    ShowtimeCreationService,
    TicketPurchaseProcessor
} from 'apps/applications'
import {
    CustomersClient,
    CustomersService,
    MoviesClient,
    MoviesService,
    PurchasesClient,
    PurchasesService,
    ShowtimesClient,
    TheatersClient,
    TheatersService,
    TicketHoldingClient,
    TicketHoldingService,
    TicketsClient,
    TicketsService,
    WatchRecordsClient,
    WatchRecordsService
} from 'apps/cores'
import {
    PaymentsClient,
    PaymentsService,
    StorageFilesClient,
    StorageFilesService
} from 'apps/infrastructures'
import { HttpTestContext, TestContext } from 'testlib'

export interface AllProviders {
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
    paymentsClient: PaymentsClient
    paymentsService: PaymentsService
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
    ticketPurchaseProcessor: TicketPurchaseProcessor
    watchRecordsService: WatchRecordsService
    watchRecordsClient: WatchRecordsClient
    showtimesClient: ShowtimesClient
}

export async function getAllProviders(
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
    const ticketPurchaseProcessor = appsModule.get(TicketPurchaseProcessor)
    const showtimesClient = appsModule.get(ShowtimesClient)
    const watchRecordsClient = appsModule.get(WatchRecordsClient)

    const { module: coresModule } = coresContext
    const paymentsClient = coresModule.get(PaymentsClient)
    const customersService = coresModule.get(CustomersService)
    const moviesService = coresModule.get(MoviesService)
    const purchasesService = coresModule.get(PurchasesService)
    const theatersService = coresModule.get(TheatersService)
    const ticketHoldingService = coresModule.get(TicketHoldingService)
    const ticketsService = coresModule.get(TicketsService)
    const watchRecordsService = coresModule.get(WatchRecordsService)

    const { module: infrasModule } = infrasContext
    const storageFilesService = infrasModule.get(StorageFilesService)
    const paymentsService = infrasModule.get(PaymentsService)

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
        paymentsClient,
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
        storageFilesService,
        ticketPurchaseProcessor,
        paymentsService,
        watchRecordsService,
        watchRecordsClient,
        showtimesClient
    }
}
