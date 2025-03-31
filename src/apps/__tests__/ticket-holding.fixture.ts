import { TicketHoldingClient } from 'apps/cores'
import { AllTestContexts, createAllTestContexts } from './utils'

export interface Fixture {
    testContext: AllTestContexts
    ticketHoldingService: TicketHoldingClient
}

export async function createFixture() {
    const testContext = await createAllTestContexts()
    const module = testContext.appsContext.module

    const ticketHoldingService = module.get(TicketHoldingClient)

    return { testContext, ticketHoldingService }
}

export async function closeFixture(fixture: Fixture) {
    await fixture.testContext.close()
}
