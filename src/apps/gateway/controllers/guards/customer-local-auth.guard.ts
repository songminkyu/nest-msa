import { Injectable, UnauthorizedException } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { CommonErrors } from 'common'

@Injectable()
export class CustomerLocalAuthGuard extends AuthGuard('customer-local') {
    handleRequest(err: any, user: any) {
        if (err || !user) {
            throw new UnauthorizedException(CommonErrors.Auth.Unauthorized)
        }
        return user
    }
}
