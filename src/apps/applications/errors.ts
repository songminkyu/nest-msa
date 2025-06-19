import {
    BookingServiceErrors,
    TicketPurchaseErrors,
    ShowtimeBatchValidatorServiceErrors
} from './services'

export const ApplicationErrors = {
    TicketPurchase: TicketPurchaseErrors,
    ShowtimeCreation: ShowtimeBatchValidatorServiceErrors,
    Booking: BookingServiceErrors
}
