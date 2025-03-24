import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common'

export const MulterExceptionFilterErrors = {
    MaxCountExceeded: {
        code: 'ERR_FILE_UPLOAD_MAX_COUNT_EXCEEDED',
        message: 'Too many files'
    },
    MaxSizeExceeded: {
        code: 'ERR_FILE_UPLOAD_MAX_SIZE_EXCEEDED',
        message: 'File too large'
    }
}

@Catch(HttpException)
export class MulterExceptionFilter implements ExceptionFilter {
    catch(exception: any, _host: ArgumentsHost) {
        let statusCode = exception.getStatus()
        let response = exception.getResponse()

        if (typeof response === 'object' && 'message' in response) {
            if (statusCode === 400 && response.message === 'Too many files') {
                exception.response = MulterExceptionFilterErrors.MaxCountExceeded
            } else if (statusCode === 413 && response.message === 'File too large') {
                exception.response = MulterExceptionFilterErrors.MaxSizeExceeded
            }

            throw exception
        }
    }
}
