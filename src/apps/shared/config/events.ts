import { createMessagePatternMap, getProjectName } from './utils'

export const Events = createMessagePatternMap(
    {
        ShowtimeCreation: {
            statusChanged: null
        },
        PurchaseProcess: {
            TicketPurchased: null,
            TicketPurchaseCanceled: null
        }
    },
    `${getProjectName()}.event`
)
