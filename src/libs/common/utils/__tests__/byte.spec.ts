import { Byte } from 'common'

describe('Byte', () => {
    describe('fromString', () => {
        // 유효한 크기 문자열을 바이트 단위 숫자로 변환해야 한다
        it('Should convert a valid size string to a number in bytes', () => {
            expect(Byte.fromString('1024B')).toEqual(1024)
            expect(Byte.fromString('1KB')).toEqual(1024)
            expect(Byte.fromString('1MB')).toEqual(1024 * 1024)
            expect(Byte.fromString('1GB')).toEqual(1024 * 1024 * 1024)
            expect(Byte.fromString('1TB')).toEqual(1024 * 1024 * 1024 * 1024)
            expect(Byte.fromString('1KB 512B')).toEqual(1536)
            expect(Byte.fromString('1.5KB')).toEqual(1536)
            expect(Byte.fromString('-1KB')).toEqual(-1024)
            expect(Byte.fromString('1GB 256MB 128KB')).toEqual(
                1 * 1024 * 1024 * 1024 + 256 * 1024 * 1024 + 128 * 1024
            )
        })

        // 소문자 단위의 문자열을 바이트로 변환해야 한다
        it('Should convert lowercase unit strings to bytes', () => {
            expect(Byte.fromString('1024b')).toEqual(1024)
            expect(Byte.fromString('1kb')).toEqual(1024)
            expect(Byte.fromString('1mb')).toEqual(1024 * 1024)
            expect(Byte.fromString('1gb')).toEqual(1024 * 1024 * 1024)
            expect(Byte.fromString('1tb')).toEqual(1024 * 1024 * 1024 * 1024)
        })

        // 잘못된 형식인 경우 예외를 던져야 한다
        it('Should throw an exception for invalid formats', () => {
            expect(() => Byte.fromString('invalid')).toThrow()
            expect(() => Byte.fromString('123')).toThrow()
            expect(() => Byte.fromString('123XB')).toThrow()
            expect(() => Byte.fromString('1KB -')).toThrow()
        })
    })

    describe('toString', () => {
        // 바이트 값을 사람이 읽기 쉬운 문자열로 변환해야 한다
        it('Should convert byte values into a human-readable string', () => {
            expect(Byte.toString(0)).toEqual('0B')
            expect(Byte.toString(1024)).toEqual('1KB')
            expect(Byte.toString(1536)).toEqual('1KB512B')
            expect(Byte.toString(1024 * 1024)).toEqual('1MB')
            expect(Byte.toString(1024 * 1024 * 1.5)).toEqual('1MB512KB')
            expect(Byte.toString(-1024)).toEqual('-1KB')
            expect(Byte.toString(1 * 1024 * 1024 * 1024 + 256 * 1024 * 1024 + 128 * 1024)).toEqual(
                '1GB256MB128KB'
            )
        })
    })
})
