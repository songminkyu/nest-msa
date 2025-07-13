import { MongooseErrors } from './mongoose'
import { JwtAuthServiceErrors } from './services'
import { LatLongErrors, PaginationErrors } from './types'

export const CommonErrors = {
    Mongoose: MongooseErrors,
    LatLong: LatLongErrors,
    JwtAuth: JwtAuthServiceErrors,
    Pagination: PaginationErrors
}
