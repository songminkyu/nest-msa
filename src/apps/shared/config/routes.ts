import { ProjectName } from './etc'
import { createRouteMap, uniqueWhenTesting } from './utils'

export const Routes = {
    Http: {
        /*
        Refer to the path in the MoviesService.
        MoviesService에서 경로를 참조한다.
        */
        StorageFiles: '/storage-files'
    }
}

export const Messages = createRouteMap(
    {
        StorageFiles: {
            saveFiles: null,
            getFiles: null,
            deleteFiles: null
        },
        Payments: {
            processPayment: null,
            getPayments: null
        },
        WatchRecords: {
            createWatchRecord: null,
            findWatchRecords: null
        },
        Tickets: {
            createTickets: null,
            updateTicketStatus: null,
            findAllTickets: null,
            getSalesStatuses: null,
            getTickets: null
        },
        TicketHolding: {
            holdTickets: null,
            findHeldTicketIds: null,
            releaseTickets: null
        },
        Theaters: {
            createTheater: null,
            updateTheater: null,
            getTheaters: null,
            deleteTheaters: null,
            findTheaters: null,
            theatersExist: null
        },
        Showtimes: {
            createShowtimes: null,
            getShowtimes: null,
            findAllShowtimes: null,
            findShowingMovieIds: null,
            findTheaterIds: null,
            findShowdates: null
        },
        Purchases: {
            createPurchase: null,
            getPurchases: null
        },
        Movies: {
            createMovie: null,
            updateMovie: null,
            getMovies: null,
            deleteMovies: null,
            findMovies: null,
            getMoviesByIds: null,
            moviesExist: null
        },
        Customers: {
            createCustomer: null,
            updateCustomer: null,
            getCustomers: null,
            deleteCustomers: null,
            findCustomers: null,
            login: null,
            refreshAuthTokens: null,
            authenticateCustomer: null
        },
        ShowtimeCreation: {
            findMovies: null,
            findTheaters: null,
            findShowtimes: null,
            createBatchShowtimes: null
        },
        Recommendation: {
            findRecommendedMovies: null
        },
        PurchaseProcess: {
            processPurchase: null
        },
        Booking: {
            findShowingTheaters: null,
            findShowdates: null,
            findShowtimes: null,
            getAvailableTickets: null,
            holdTickets: null
        }
    },
    uniqueWhenTesting(`${ProjectName}.message`)
)

export const Events = createRouteMap(
    {
        ShowtimeCreation: {
            statusChanged: null
        },
        PurchaseProcess: {
            TicketPurchased: null,
            TicketPurchaseCanceled: null
        }
    },
    uniqueWhenTesting(`${ProjectName}.event`)
)
