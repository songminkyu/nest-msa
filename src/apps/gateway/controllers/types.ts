import { CustomerAuthPayload } from 'apps/cores'
import { Request } from 'express'

export interface CustomerAuthRequest extends Request {
    user: CustomerAuthPayload
}
