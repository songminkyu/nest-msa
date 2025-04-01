import { CommonErrors } from 'common'
import { withTestId } from 'testlib'
import type { Fixture } from './pagination.fixture'

describe('Pagination', () => {
    let fix: Fixture

    beforeEach(async () => {
        const { createFixture } = await import('./pagination.fixture')
        fix = await createFixture()
    })

    afterEach(async () => {
        await fix?.teardown()
    })

    /* HttpController에서 PaginationOptionDto을 처리해야 한다 */
    it('should handle PaginationOptionDto in HttpController', async () => {
        const skip = 2
        const take = 3
        await fix.httpClient
            .get('/pagination')
            .query({ skip, take, orderby: 'name:asc' })
            .ok({ response: { orderby: { direction: 'asc', name: 'name' }, skip, take } })
    })

    /* RpcController에서 PaginationOptionDto을 처리해야 한다 */
    it('should handle PaginationOptionDto in RpcController', async () => {
        const skip = 2
        const take = 3
        const input = { orderby: { direction: 'asc', name: 'name' }, skip, take }

        await fix.rpcClient.expect(withTestId('getRpcPagination'), input, {
            response: input
        })
    })

    /* orderby 형식이 잘못되었을 때 BadRequest를 반환해야 한다 */
    it('should return BadRequest when the orderby format is invalid', async () => {
        await fix.httpClient
            .get('/pagination')
            .query({ orderby: 'wrong' })
            .badRequest(CommonErrors.Pagination.FormatInvalid)
    })

    /* 정렬 방향이 잘못되었을 때 BadRequest를 반환해야 한다 */
    it('should return BadRequest when the sort direction is invalid', async () => {
        await fix.httpClient
            .get('/pagination')
            .query({ orderby: 'name:wrong' })
            .badRequest(CommonErrors.Pagination.DirectionInvalid)
    })

    /* 'take' 값이 지정된 제한을 초과하면 BadRequest를 반환해야 한다 */
    it("should return BadRequest when the 'take' value exceeds the specified limit", async () => {
        const take = 51

        await fix.httpClient
            .get('/pagination/limited')
            .query({ take })
            .badRequest({ ...CommonErrors.Pagination.TakeLimitExceeded, take, takeLimit: 50 })
    })

    /* 'take' 값이 지정되지 않은 경우 기본값이 사용되어야 한다 */
    it("should use the default value if the 'take' value is not specified", async () => {
        await fix.httpClient
            .get('/pagination/limited')
            .query({})
            .ok({ response: { skip: 0, take: 50 } })
    })
})
