import { MongooseErrors } from './mongoose'
import { PaginationErrors } from './query'
import { JwtAuthServiceErrors } from './services'
import { LatLongErrors } from './types'

export const CommonErrors = {
    Mongoose: MongooseErrors,
    Pagination: PaginationErrors,
    LatLong: LatLongErrors,
    JwtAuth: JwtAuthServiceErrors
}
