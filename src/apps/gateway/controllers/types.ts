import { AuthTokenPayload } from 'common'
import { Request } from 'express'

export interface AuthRequest extends Request {
    user: AuthTokenPayload
}
