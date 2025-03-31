import { BadRequestException } from '@nestjs/common'
import { DateUtil } from 'common'

export const PurchaseErrors = {
    MaxTicketsExceeded: {
        code: 'ERR_PURCHASE_MAX_TICKETS_EXCEEDED',
        message: 'You have exceeded the maximum number of tickets allowed for purchase.'
    },
    DeadlineExceeded: {
        code: 'ERR_PURCHASE_DEADLINE_EXCEEDED',
        message: 'The purchase deadline has passed.'
    },
    TicketNotHeld: {
        code: 'ERR_PURCHASE_TICKET_NOT_HELD',
        message: 'Only held tickets can be purchased.'
    }
}

// Purchase를 모델로 만드는 것은?
// TODO to Config
// TODO 이거 static class로 만들어라
const PURCHASE_MAX_TICKETS = 10
const PURCHASE_DEADLINE_MINUTES = 30

export function checkMaxTicketsForPurchase(ticketCount: number) {
    if (PURCHASE_MAX_TICKETS < ticketCount) {
        throw new BadRequestException({
            ...PurchaseErrors.MaxTicketsExceeded,
            maxCount: PURCHASE_MAX_TICKETS
        })
    }
}

export function checkPurchaseDeadline(startTime: Date) {
    const cutoffTime = DateUtil.addMinutes(new Date(), PURCHASE_DEADLINE_MINUTES)

    if (startTime.getTime() < cutoffTime.getTime()) {
        throw new BadRequestException({
            ...PurchaseErrors.DeadlineExceeded,
            deadlineMinutes: PURCHASE_DEADLINE_MINUTES,
            startTime: startTime.toString(),
            cutoffTime: cutoffTime.toString()
        })
    }
}

export function checkHeldTickets(heldTicketIds: string[], purchaseTicketIds: string[]) {
    const isAllExist = purchaseTicketIds.every((ticketId) => heldTicketIds.includes(ticketId))

    if (!isAllExist) {
        throw new BadRequestException(PurchaseErrors.TicketNotHeld)
    }
}
