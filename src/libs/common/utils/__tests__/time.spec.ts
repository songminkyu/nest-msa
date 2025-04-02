import { Time } from 'common'

describe('DateUtil', () => {
    describe('toMs', () => {
        /* 시간 형식 문자열을 밀리초(ms)로 변환해야 한다 */
        it('should convert a time format string into milliseconds (ms)', () => {
            expect(Time.toMs('30m')).toEqual(30 * 60 * 1000)
            expect(Time.toMs('45s')).toEqual(45 * 1000)
            expect(Time.toMs('1d')).toEqual(24 * 60 * 60 * 1000)
            expect(Time.toMs('2h')).toEqual(2 * 60 * 60 * 1000)
            expect(Time.toMs('1d 2h')).toEqual((24 + 2) * 60 * 60 * 1000)
            expect(Time.toMs('1d2h')).toEqual((24 + 2) * 60 * 60 * 1000)
            expect(Time.toMs('-30s')).toEqual(-30 * 1000)
            expect(Time.toMs('0.5s')).toEqual(0.5 * 1000)
            expect(Time.toMs('500ms')).toEqual(500)
        })

        /* 잘못된 형식 입력 시 예외를 던져야 한다 */
        it('should throw an exception for invalid input format', () => {
            expect(() => Time.toMs('2z')).toThrow(Error)
        })
    })

    describe('fromMs', () => {
        /* 밀리초(ms)를 시간 형식 문자열로 변환해야 한다 */
        it('should convert milliseconds (ms) to a time format string', () => {
            expect(Time.fromMs(30 * 60 * 1000)).toEqual('30m')
            expect(Time.fromMs(45 * 1000)).toEqual('45s')
            expect(Time.fromMs(24 * 60 * 60 * 1000)).toEqual('1d')
            expect(Time.fromMs(2 * 60 * 60 * 1000)).toEqual('2h')
            expect(Time.fromMs((24 + 2) * 60 * 60 * 1000)).toEqual('1d2h')
            expect(Time.fromMs(500)).toEqual('500ms')
            expect(Time.fromMs(0)).toEqual('0ms')
            expect(Time.fromMs(-30 * 1000)).toEqual('-30s')
        })
    })
})
