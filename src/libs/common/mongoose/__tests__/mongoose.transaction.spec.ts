import type { Fixture } from './mongoose.transaction.fixture'

describe('MongooseRepository.withTransaction', () => {
    let fix: Fixture

    beforeEach(async () => {
        const { createFixture } = await import('./mongoose.transaction.fixture')
        fix = await createFixture()
    })

    afterEach(async () => {
        await fix?.teardown()
    })

    // 트랜잭션을 커밋해야 한다.
    it('Should commit a transaction', async () => {
        const newDoc = await fix.repository.withTransaction(async (session) => {
            const doc = fix.repository.newDocument()
            doc.name = 'name'
            return doc.save({ session })
        })

        const found = await fix.repository.findById(newDoc.id)
        expect(found?.toJSON()).toEqual(newDoc.toJSON())
    })

    // 트랜잭션을 롤백해야 한다.
    it('Should roll back a transaction', async () => {
        const newDoc = fix.repository.newDocument()
        newDoc.name = 'name'
        await newDoc.save()

        await fix.repository.withTransaction(async (session, rollback) => {
            await fix.repository.deleteById(newDoc.id, session)
            rollback()
        })

        const found = await fix.repository.findById(newDoc.id)
        expect(found?.toJSON()).toEqual(newDoc.toJSON())
    })

    // 트랜잭션 중 오류가 발생하면 변경 사항을 롤백해야 한다
    it('Should roll back changes if an error occurs during the transaction', async () => {
        const promise = fix.repository.withTransaction(async (session) => {
            const doc = fix.repository.newDocument()
            doc.name = 'name'
            await doc.save({ session })

            throw new Error('An error occurred during the transaction.')
        })

        await expect(promise).rejects.toThrow()

        const { total } = await fix.repository.findWithPagination({ pagination: {} })
        expect(total).toEqual(0)
    })

    it('dummy test for coverage', async () => {
        jest.spyOn(fix.model, 'startSession').mockImplementation(() => {
            throw new Error()
        })

        const promise = fix.repository.withTransaction(async (_session) => {})

        await expect(promise).rejects.toThrow()
    })

    it('dummy test for coverage', async () => {
        jest.spyOn(fix.model, 'startSession').mockResolvedValue({
            startTransaction: jest.fn().mockImplementation(() => {
                throw new Error()
            }),
            inTransaction: jest.fn().mockReturnValue(false)
        } as any)

        const promise = fix.repository.withTransaction(async (_session) => {})

        await expect(promise).rejects.toThrow()
    })
})
