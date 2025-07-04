export const CommonQueryErrors = {
    TakeLimitExceeded: {
        code: 'ERR_PAGINATION_TAKE_LIMIT_EXCEEDED',
        message: "The 'take' parameter exceeds the maximum allowed limit"
    },
    FormatInvalid: {
        code: 'ERR_PAGINATION_ORDERBY_FORMAT_INVALID',
        message: "Invalid orderby format. It should be 'name:direction'"
    },
    DirectionInvalid: {
        code: 'ERR_PAGINATION_ORDERBY_DIRECTION_INVALID',
        message: 'Invalid direction. It should be either "asc" or "desc".'
    }
}
