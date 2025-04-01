import { getCounter, incrementCounter } from './reset-modules.fixture'

const mockForResetTest = jest.fn().mockReturnValue('value')

/* resetModules 기능 검증 */
describe('verify resetModules feature', () => {
    /* 카운터 초기값 확인 및 증가 테스트 */
    it('checks initial counter value and increments it', () => {
        expect(getCounter()).toBe(0)
        incrementCounter()
        expect(getCounter()).toBe(1)
    })

    /* resetModules가 true여도 모듈 캐시로 인한 상태가 유지됨 */
    it('demonstrates that state persists due to module cache even if resetModules is true', () => {
        expect(getCounter()).toBe(1)
    })

    /* 동적 모듈 임포트를 하면 최상위 import에 의한 모듈 캐시에 영향을 받지 않음 */
    it('confirms that dynamic import does not rely on the module cache from the top-level import', async () => {
        const { getCounter: getFreshCounter } = await import('./reset-modules.fixture')

        expect(getFreshCounter()).toBe(0)
    })

    /* resetMocks가 모킹을 초기화 하는지 검증 */
    it('checks whether resetMocks properly resets mocks', () => {
        expect(mockForResetTest()).not.toEqual('value')
    })
})
