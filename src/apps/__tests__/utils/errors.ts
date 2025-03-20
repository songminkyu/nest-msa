import { Errors as AppsErrors } from 'apps/applications/errors'
import { Errors as CoreErrors } from 'apps/cores/errors'
import { Errors as GatewayErrors } from 'apps/gateway/errors'
import { Errors as CommonErrors } from 'common/errors'
import { Errors as SharedErrors } from 'shared/errors'

export const Errors = {
    ...CommonErrors,
    ...SharedErrors,
    ...GatewayErrors,
    ...AppsErrors,
    ...CoreErrors
}
