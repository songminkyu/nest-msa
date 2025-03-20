import { ApplicationsErrors } from 'apps/applications/application-errors'
import { CoreErrors } from 'apps/cores/core-errors'
import { GatewayErrors } from 'apps/gateway/gateway-errors'
import { CommonErrors } from 'common/common-errors'
import { SharedErrors } from 'shared'

export const Errors = {
    ...CommonErrors,
    ...SharedErrors,
    ...GatewayErrors,
    ...ApplicationsErrors,
    ...CoreErrors
}
