export const GatewayErrors = {
    FileUpload: {
        MaxCountExceeded: {
            code: 'ERR_FILE_UPLOAD_MAX_COUNT_EXCEEDED',
            message: 'Too many files'
        },
        MaxSizeExceeded: {
            code: 'ERR_FILE_UPLOAD_MAX_SIZE_EXCEEDED',
            message: 'File too large'
        },
        InvalidFileType: {
            code: 'ERR_FILE_UPLOAD_INVALID_FILE_TYPE',
            message: 'File type not allowed.'
        }
    },
    Auth: {
        Unauthorized: {
            code: 'ERR_AUTH_UNAUTHORIZED',
            message: 'Unauthorized'
        }
    }
}
