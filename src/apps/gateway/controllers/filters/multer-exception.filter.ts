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

/**
 * Multer가 발생시키는 예외는 직접 수정할 수 없다.
 * 그래서 ExceptionFilter를 통해 예외에 코드 값을 추가하여 처리한다.
 */
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
        }

        throw exception
    }
}
