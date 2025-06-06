import {
    BookingServiceErrors,
    PurchaseErrors,
    ShowtimeCreationValidatorServiceErrors
} from './services'

export const ApplicationErrors = {
    Purchase: PurchaseErrors,
    ShowtimeCreation: ShowtimeCreationValidatorServiceErrors,
    Booking: BookingServiceErrors
}
