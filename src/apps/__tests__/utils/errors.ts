import { ApplicationsErrors } from 'applications/application-errors'
import { CommonErrors } from 'common'
import { CoreErrors } from 'cores/core-errors'
import { GatewayErrors } from 'gateway/gateway-errors'
import { SharedErrors } from 'shared'

export const Errors = {
    ...CommonErrors,
    ...SharedErrors,
    ...GatewayErrors,
    ...ApplicationsErrors,
    ...CoreErrors
}
