import { ApplicationsErrors } from 'apps/applications/application-errors'
import { CommonErrors } from 'common'
import { CoreErrors } from 'apps/cores/core-errors'
import { GatewayErrors } from 'apps/gateway/gateway-errors'
import { SharedErrors } from 'shared'

export const Errors = {
    ...CommonErrors,
    ...SharedErrors,
    ...GatewayErrors,
    ...ApplicationsErrors,
    ...CoreErrors
}
