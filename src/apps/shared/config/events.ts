import { createRouteMap, getProjectName } from './utils'

export const Events = createRouteMap(
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
