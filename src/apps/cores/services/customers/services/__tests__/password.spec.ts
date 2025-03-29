import { CustomerAuthenticationService } from '..'

describe('CustomerAuthenticationService', () => {
    let service: CustomerAuthenticationService

    beforeEach(() => {
        const mockRepository = {} as any
        const mockJwtService = {} as any
        service = new CustomerAuthenticationService(mockRepository, mockJwtService)
    })

    it('비밀번호를 해싱해야 한다', async () => {
        const password = 'password'
        const hashedPassword = await service.hash(password)

        expect(hashedPassword).not.toEqual(password)
    })

    it('같은 비밀번호에 대해서 서로 다른 해시 값을 생성해야 한다', async () => {
        const password = 'password'
        const firstHash = await service.hash(password)
        const secondHash = await service.hash(password)

        expect(firstHash).not.toEqual(secondHash)
    })

    it('비밀번호가 일치하면 true를 반환해야 한다', async () => {
        const password = 'password'
        const hashedPassword = await service.hash(password)

        const isValidPassword = await service.validate(password, hashedPassword)

        expect(isValidPassword).toBeTruthy()
    })

    it('비밀번호가 일치하지 않으면 false를 반환해야 한다', async () => {
        const password = 'password'
        const hashedPassword = await service.hash(password)

        const isValidPassword = await service.validate('wrongpassword', hashedPassword)

        expect(isValidPassword).toBeFalsy()
    })
})
