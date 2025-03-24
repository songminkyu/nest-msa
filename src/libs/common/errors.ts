import { MongooseErrors } from './mongoose'
import { JwtAuthServiceErrors } from './services'
import { LatLongErrors, PaginationErrors } from './types'

export const CommonErrors = {
    Mongoose:MongooseErrors,
    Pagination:PaginationErrors,
    LatLong:LatLongErrors,
    JwtAuth:JwtAuthServiceErrors
}
