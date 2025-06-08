import {
    BookingServiceErrors,
    PurchaseErrors,
    ShowtimeBatchValidatorServiceErrors
} from './services'

export const ApplicationErrors = {
    Purchase: PurchaseErrors,
    ShowtimeCreation: ShowtimeBatchValidatorServiceErrors,
    Booking: BookingServiceErrors
}
