import { Injectable, UnauthorizedException } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { GatewayErrors } from 'apps/gateway/gateway-errors'

@Injectable()
export class CustomerLocalAuthGuard extends AuthGuard('customer-local') {
    handleRequest(err: any, user: any) {
        if (err || !user) {
            throw new UnauthorizedException(GatewayErrors.Auth.Unauthorized)
        }
        return user
    }
}
