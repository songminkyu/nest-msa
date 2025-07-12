import { ProjectName } from './etc'
import { createRouteMap, makeName } from './utils'

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
    makeName(`${ProjectName}.event`)
)
