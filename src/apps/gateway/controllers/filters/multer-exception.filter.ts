import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common'
import { GatewayErrors } from 'apps/gateway/gateway-errors'
import { Response } from 'express'

@Catch(HttpException)
export class MulterExceptionFilter implements ExceptionFilter {
    catch(exception: any, host: ArgumentsHost) {
        const http = host.switchToHttp()
        const response = http.getResponse<Response>()

        let statusCode = exception.getStatus()
        let responseBody = exception.getResponse()

        if (typeof responseBody === 'object' && 'message' in responseBody) {
            if (statusCode === 400 && responseBody.message === 'Too many files') {
                responseBody = GatewayErrors.FileUpload.MaxCountExceeded
            } else if (statusCode === 413 && responseBody.message === 'File too large') {
                responseBody = GatewayErrors.FileUpload.MaxSizeExceeded
            }
        }

        response.status(statusCode).json(responseBody)
    }
}
