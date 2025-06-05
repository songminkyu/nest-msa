import { ProjectName } from './etc'
import { createRouteMap, uniqueWhenTesting } from './utils'

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
    uniqueWhenTesting(`${ProjectName}.event`)
)
