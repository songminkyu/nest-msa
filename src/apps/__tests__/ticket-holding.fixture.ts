import { TicketHoldingClient } from 'apps/cores'
import { AllTestContexts, createAllTestContexts } from './utils'

export interface Fixture {
    testContext: AllTestContexts
    ticketHoldingClient: TicketHoldingClient
}

export async function createFixture() {
    const testContext = await createAllTestContexts()
    const { appsContext } = testContext

    const ticketHoldingClient = appsContext.module.get(TicketHoldingClient)

    return { testContext, ticketHoldingClient }
}

export async function closeFixture(fixture: Fixture) {
    await fixture.testContext.close()
}
