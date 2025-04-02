import { TicketHoldingClient, TicketHoldingService } from 'apps/cores'
import { AllTestContexts, createAllTestContexts } from './utils'

export interface Fixture {
    testContext: AllTestContexts
    ticketHoldingClient: TicketHoldingClient
    ticketHoldingService: TicketHoldingService
}

export async function createFixture() {
    const testContext = await createAllTestContexts()
    const { appsContext, coresContext } = testContext

    const ticketHoldingClient = appsContext.module.get(TicketHoldingClient)
    const ticketHoldingService = coresContext.module.get(TicketHoldingService)

    return { testContext, ticketHoldingClient, ticketHoldingService }
}

export async function closeFixture(fixture: Fixture) {
    await fixture.testContext.close()
}
