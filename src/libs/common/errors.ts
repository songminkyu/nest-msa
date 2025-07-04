import { CommonQueryErrors } from './common-query'
import { MongooseErrors } from './mongoose'
import { JwtAuthServiceErrors } from './services'
import { LatLongErrors } from './types'

export const CommonErrors = {
    Mongoose: MongooseErrors,
    CommonQuery: CommonQueryErrors,
    LatLong: LatLongErrors,
    JwtAuth: JwtAuthServiceErrors
}
