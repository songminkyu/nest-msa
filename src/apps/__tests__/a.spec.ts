import { Fixture } from './ticket-holding.fixture'

describe('A', () => {
    let fix: Fixture

    beforeEach(async () => {
        const { createFixture } = await import('./a.fixture')
        fix = await createFixture()
    })

    afterEach(async () => {
        await fix?.teardown()
    })

    it('test', async () => {
        console.log('------B')
    })
})
