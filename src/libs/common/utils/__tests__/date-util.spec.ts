import { DateUtil } from 'common'

describe('DateUtil', () => {
    describe('toMs', () => {
        /* 시간 형식 문자열을 밀리초(ms)로 변환해야 한다 */
        it('should convert a time format string into milliseconds (ms)', () => {
            expect(DateUtil.toMs('30m')).toEqual(30 * 60 * 1000)
            expect(DateUtil.toMs('45s')).toEqual(45 * 1000)
            expect(DateUtil.toMs('1d')).toEqual(24 * 60 * 60 * 1000)
            expect(DateUtil.toMs('2h')).toEqual(2 * 60 * 60 * 1000)
            expect(DateUtil.toMs('1d 2h')).toEqual((24 + 2) * 60 * 60 * 1000)
            expect(DateUtil.toMs('1d2h')).toEqual((24 + 2) * 60 * 60 * 1000)
            expect(DateUtil.toMs('-30s')).toEqual(-30 * 1000)
            expect(DateUtil.toMs('0.5s')).toEqual(0.5 * 1000)
            expect(DateUtil.toMs('500ms')).toEqual(500)
        })

        /* 잘못된 형식 입력 시 예외를 던져야 한다 */
        it('should throw an exception for invalid input format', () => {
            expect(() => DateUtil.toMs('2z')).toThrow(Error)
        })
    })

    describe('fromMs', () => {
        /* 밀리초(ms)를 시간 형식 문자열로 변환해야 한다 */
        it('should convert milliseconds (ms) to a time format string', () => {
            expect(DateUtil.fromMs(30 * 60 * 1000)).toEqual('30m')
            expect(DateUtil.fromMs(45 * 1000)).toEqual('45s')
            expect(DateUtil.fromMs(24 * 60 * 60 * 1000)).toEqual('1d')
            expect(DateUtil.fromMs(2 * 60 * 60 * 1000)).toEqual('2h')
            expect(DateUtil.fromMs((24 + 2) * 60 * 60 * 1000)).toEqual('1d2h')
            expect(DateUtil.fromMs(500)).toEqual('500ms')
            expect(DateUtil.fromMs(0)).toEqual('0ms')
            expect(DateUtil.fromMs(-30 * 1000)).toEqual('-30s')
        })
    })

    describe('fromYMD', () => {
        /* YYYYMMDDHHmm 형식 문자열을 Date 객체로 변환 */
        it('should convert a YYYYMMDDHHmm format string to a Date object', () => {
            const date = DateUtil.fromYMD('199901020930')
            expect(date.getFullYear()).toEqual(1999)
            expect(date.getMonth()).toEqual(0) // 1월은 0이다.
            expect(date.getDate()).toEqual(2)
            expect(date.getHours()).toEqual(9)
            expect(date.getMinutes()).toEqual(30)
        })

        /* 잘못된 형식 입력 시 예외를 던져야 한다 */
        it('should throw an exception for invalid format input', () => {
            expect(() => DateUtil.fromYMD('')).toThrow()
        })
    })

    describe('toYMD', () => {
        /* Date 객체를 YYYYMMDD 형식 문자열로 변환 */
        it('should convert a Date object to a YYYYMMDD format string', () => {
            const dateString = DateUtil.toYMD(new Date('1999-01-02'))
            expect(dateString).toEqual('19990102')
        })
    })

    describe('addDays', () => {
        /* 기준 날짜에 지정된 일수를 더한 날짜 반환 */
        it('should return the date with the specified number of days added', () => {
            const baseDate = new Date('2020-01-01T00:00:00Z')
            const updatedDate = DateUtil.addDays(baseDate, 2)
            expect(updatedDate).toEqual(new Date('2020-01-03T00:00:00Z'))
        })
    })

    describe('addMinutes', () => {
        /* 기준 날짜에 지정된 분을 더한 날짜 반환 */
        it('should return the date with the specified number of minutes added', () => {
            const baseDate = new Date('2020-01-01T00:00:00Z')
            const updatedDate = DateUtil.addMinutes(baseDate, 90)
            expect(updatedDate).toEqual(new Date('2020-01-01T01:30:00Z'))
        })
    })

    describe('earliest/latest', () => {
        const dates = [
            new Date('2022-01-01T12:00:00Z'),
            new Date('2022-01-03T15:30:00Z'),
            new Date('2022-01-02T09:20:00Z')
        ]

        /* 날짜 배열에서 가장 이른 날짜 찾기 */
        it('should find the earliest date from an array of dates', () => {
            const date = DateUtil.earliest(dates)
            expect(date).toEqual(new Date('2022-01-01T12:00:00Z'))
        })

        /* 날짜 배열에서 가장 늦은 날짜 찾기 */
        it('should find the latest date from an array of dates', () => {
            const date = DateUtil.latest(dates)
            expect(date).toEqual(new Date('2022-01-03T15:30:00Z'))
        })
    })
})
