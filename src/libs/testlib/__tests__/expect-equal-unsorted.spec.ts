import { expectEqualUnsorted } from 'testlib'

describe('expectEqualUnsorted', () => {
    it('객체 배열을 순서에 상관없이 비교해야 한다', () => {
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

    it('중첩된 객체 배열을 비교해야 한다', () => {
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

    it('expect.anything() 필드를 무시해야 한다', () => {
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

    it('배열이 다르면 예외를 발생시켜야 한다', () => {
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

    it('actual 또는 expected가 undefined이면 예외를 발생시켜야 한다', () => {
        expect(() => expectEqualUnsorted(undefined, [])).toThrow('actual or expected undefined')
        expect(() => expectEqualUnsorted([], undefined)).toThrow('actual or expected undefined')
    })

    it('빈 배열을 처리해야 한다', () => {
        expect(() => expectEqualUnsorted([], [])).not.toThrow()
    })
})
