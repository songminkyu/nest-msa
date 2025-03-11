import { Fixture } from './create-testing-module.fixture'

describe('createTestingModule', () => {
    let fix: Fixture

    beforeEach(async () => {
        const { createFixture } = await import('./create-testing-module.fixture')
        fix = await createFixture()
    })

    afterEach(async () => {
        await fix?.teardown()
    })

    it('overrideProviders에 설정한 모의 서비스가 응답해야 한다', async () => {
        const message = fix.sampleService.getMessage()

        expect(message).toEqual({ message: 'This is Mock' })
    })
})
