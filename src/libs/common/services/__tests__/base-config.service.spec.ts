import { Fixture } from './base-config.service.fixture'

describe('BaseConfigService', () => {
    let fix: Fixture

    beforeEach(async () => {
        const { createFixture } = await import('./base-config.service.fixture')
        fix = await createFixture()
    })

    afterEach(async () => {
        await fix?.teardown()
    })

    it('key에 해당하는 문자열을 반환해야 한다', () => {
        const result = fix.appConfigService.getTestString()
        expect(result).toBe('value')
    })

    it('key에 해당하는 숫자를 반환해야 한다', () => {
        const result = fix.appConfigService.getTestNumber()
        expect(result).toBe(123)
    })

    it('존재하지 않는 key를 요청하면 프로세스를 종료해야 한다', () => {
        const mockExit = jest.spyOn(process, 'exit').mockImplementation()
        const consoleError = jest.spyOn(console, 'error').mockImplementation()

        fix.appConfigService.throwError()

        expect(consoleError).toHaveBeenCalledWith("Key 'TEST_NOT_EXIST_KEY' is not defined")
        expect(mockExit).toHaveBeenCalledWith(1)
    })
})
