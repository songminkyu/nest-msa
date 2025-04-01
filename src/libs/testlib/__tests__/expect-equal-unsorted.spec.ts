import { expectEqualUnsorted } from 'testlib'

describe('expectEqualUnsorted', () => {
    /* 객체 배열을 순서에 상관없이 비교해야 한다 */
    it('should compare arrays of objects regardless of order', () => {
        const actual = [
            { id: 1, name: 'John', age: 30 },
            { id: 2, name: 'Jane', age: 25 }
        ]
        const expected = [
            { id: 2, name: 'Jane', age: 25 },
            { id: 1, name: 'John', age: 30 }
        ]

        expect(() => expectEqualUnsorted(actual, expected)).not.toThrow()
    })

    /* 중첩된 객체 배열을 비교해야 한다 */
    it('should compare nested arrays of objects', () => {
        const actual = [
            { id: 1, name: 'John', address: { city: 'New York', zip: '-' } },
            { id: 2, name: 'Jane', address: { city: 'Los Angeles', zip: '90001' } }
        ]
        const expected = [
            { id: 1, name: 'John', address: { city: 'New York', zip: '10001' } },
            { id: 2, name: 'Jane', address: { city: 'Los Angeles', zip: '90001' } }
        ]

        expect(() => expectEqualUnsorted(actual, expected)).toThrow()
    })

    /* expect.anything() 필드를 무시해야 한다 */
    it('should ignore fields with expect.anything()', () => {
        const actual = [
            { id: expect.anything(), name: 'Jane', age: 25 },
            { id: expect.anything(), name: 'John', age: 30 }
        ]
        const expected = [
            { id: 1, name: 'Jane', age: 25 },
            { id: 2, name: 'John', age: 30 }
        ]

        expect(() => expectEqualUnsorted(actual, expected)).not.toThrow()
    })

    /* 배열이 다르면 예외를 던져야 한다 */
    it('should throw if the arrays differ', () => {
        const actual = [
            { id: 1, name: 'John', age: 30 },
            { id: 2, name: 'Jane', age: 25 }
        ]
        const expected = [
            { id: 1, name: 'John', age: 40 },
            { id: 2, name: 'Jane', age: 25 }
        ]

        expect(() => expectEqualUnsorted(actual, expected)).toThrow()
    })

    /* actual 또는 expected가 undefined이면 예외를 던져야 한다 */
    it('should throw if actual or expected is undefined', () => {
        expect(() => expectEqualUnsorted(undefined, [])).toThrow('actual or expected undefined')
        expect(() => expectEqualUnsorted([], undefined)).toThrow('actual or expected undefined')
    })

    /* 빈 배열을 처리해야 한다 */
    it('should handle empty arrays', () => {
        expect(() => expectEqualUnsorted([], [])).not.toThrow()
    })
})
