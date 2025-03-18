import { getCounter, incrementCounter } from './reset-modules.fixture'

describe('resetModules 기능 검증', () => {
    it('카운터 초기값 확인 및 증가 테스트', () => {
        expect(getCounter()).toBe(0)
        incrementCounter()
        expect(getCounter()).toBe(1)
    })

    it('resetModules가 true여도 모듈 캐시로 인한 상태가 유지됨', () => {
        expect(getCounter()).toBe(1)
    })

    it('동적 모듈 임포트를 하면 최상위 import에 의한 모듈 캐시에 영향을 받지 않음', async () => {
        const { getCounter: getFreshCounter } = await import('./reset-modules.fixture')

        expect(getFreshCounter()).toBe(0)
    })
})
