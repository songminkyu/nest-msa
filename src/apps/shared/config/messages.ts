import { ProjectName } from './etc'
import { createRouteMap, uniqueWhenTesting } from './utils'

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
            searchWatchRecordsPage: null
        },
        Tickets: {
            createTickets: null,
            updateTicketStatus: null,
            searchTickets: null,
            getSalesStatuses: null,
            getTickets: null
        },
        TicketHolding: {
            holdTickets: null,
            searchHeldTicketIds: null,
            releaseTickets: null
        },
        Theaters: {
            createTheater: null,
            updateTheater: null,
            getTheaters: null,
            deleteTheaters: null,
            searchTheatersPage: null,
            theatersExist: null
        },
        Showtimes: {
            createShowtimes: null,
            getShowtimes: null,
            searchShowtimes: null,
            searchShowingMovieIds: null,
            searchTheaterIds: null,
            searchShowdates: null
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
            searchMoviesPage: null,
            getMoviesByIds: null,
            moviesExist: null
        },
        Customers: {
            createCustomer: null,
            updateCustomer: null,
            getCustomers: null,
            deleteCustomers: null,
            searchCustomersPage: null,
            login: null,
            refreshAuthTokens: null,
            authenticateCustomer: null
        },
        ShowtimeCreation: {
            searchMoviesPage: null,
            searchTheatersPage: null,
            searchShowtimes: null,
            createBatchShowtimes: null
        },
        Recommendation: {
            searchRecommendedMovies: null
        },
        PurchaseProcess: {
            processPurchase: null
        },
        Booking: {
            searchShowingTheaters: null,
            searchShowdates: null,
            searchShowtimes: null,
            getAvailableTickets: null,
            holdTickets: null
        }
    },
    uniqueWhenTesting(`${ProjectName}.message`)
)
