/*
If you use useFakeTimers(), Mongoose(MongoDB)-related code may not work properly.
It may also affect other modules, so it's recommended not to use it.
useFakeTimers()를 사용하면 Mongoose(MongoDB) 관련 코드가 제대로 동작하지 않는다.
다른 모듈에도 영향을 줄 가능성이 있기 때문에 사용하지 않는 것을 권장한다.
*/

describe('Timer functions', () => {
    beforeEach(async () => {
        jest.useFakeTimers()
    })

    afterEach(() => {
        jest.useRealTimers()
    })

    /* 타이머 함수가 올바르게 모킹되는지 확인 */
    test('Checks if the timer functions are properly mocked', () => {
        const mockCallback = jest.fn()

        setTimeout(() => mockCallback('Real value'), 1000)
        expect(mockCallback).not.toHaveBeenCalledWith('Real value')

        jest.advanceTimersByTime(1000)
        expect(mockCallback).toHaveBeenCalledWith('Real value')
    })

    /* 시스템 시간을 특정 날짜로 모킹하는지 확인 */
    it('Checks if the system time is mocked to a specific date', () => {
        const mockDate = new Date('1999-02-31T14:30')

        jest.setSystemTime(mockDate)

        const currentDate = new Date()

        expect(mockDate.toISOString()).toEqual(currentDate.toISOString())
    })
})
