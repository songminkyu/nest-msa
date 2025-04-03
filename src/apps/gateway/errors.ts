import { MulterExceptionFilterErrors, AuthErrors } from './controllers'
import { MulterConfigServiceErrors } from './modules'

export const GatewayErrors = {
    FileUpload: { ...MulterExceptionFilterErrors, ...MulterConfigServiceErrors },
    Auth: AuthErrors
}
