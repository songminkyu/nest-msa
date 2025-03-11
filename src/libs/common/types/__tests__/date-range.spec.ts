import { plainToInstance } from 'class-transformer'
import { validateSync } from 'class-validator'
import { DateRange } from 'common'

describe('DateRange', () => {
    it('문자열 날짜를 Date 객체로 변환하고 유효성 검사를 통과해야 함', () => {
        const plainData = {
            start: '2023-01-01T00:00:00Z',
            end: '2023-01-02T00:00:00Z'
        }

        const instance = plainToInstance(DateRange, plainData)

        expect(instance.start).toBeInstanceOf(Date)
        expect(instance.end).toBeInstanceOf(Date)

        const errors = validateSync(instance)
        expect(errors).toHaveLength(0)
    })

    it('유효하지 않은 날짜 문자열은 변환 후 유효성 검사 실패해야 함', () => {
        const plainData = {
            start: 'invalid-date-string',
            end: '2023-01-02T00:00:00Z'
        }

        const instance = plainToInstance(DateRange, plainData)

        expect(instance.start).toBeInstanceOf(Date)
        expect(isNaN(instance.start!.getTime())).toBe(true)

        const errors = validateSync(instance)
        expect(errors.length).toBeGreaterThan(0)
        expect(errors[0].property).toBe('start')
        expect(errors[0].constraints?.isDate).toBeDefined()
    })
})
