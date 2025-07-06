export const CommonQueryErrors = {
    MaxTakeExceeded: {
        code: 'ERR_PAGINATION_MAX_TAKE_EXCEEDED',
        message: "The 'take' parameter exceeds the maximum allowed value"
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
