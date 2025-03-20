import { Injectable, UnauthorizedException } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { Errors } from 'apps/gateway/errors'

@Injectable()
export class CustomerLocalAuthGuard extends AuthGuard('customer-local') {
    handleRequest(err: any, user: any) {
        if (err || !user) {
            throw new UnauthorizedException(Errors.Auth.Unauthorized)
        }
        return user
    }
}
