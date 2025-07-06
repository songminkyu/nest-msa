import { CommonErrors } from 'common'
import { withTestId } from 'testlib'
import { type Fixture } from './common-query.fixture'

describe('CommonQuery', () => {
    let fix: Fixture
    let maxTake = 0

    beforeEach(async () => {
        const { createFixture, maxTakeValue } = await import('./common-query.fixture')
        fix = await createFixture()
        maxTake = maxTakeValue
    })

    afterEach(async () => {
        await fix?.teardown()
    })

    // HttpController에서 CommonQueryDto을 처리해야 한다
    it('Should handle CommonQueryDto in HttpController', async () => {
        const skip = 2
        const take = 3
        await fix.httpClient
            .get('/pagination')
            .query({ skip, take, orderby: 'name:asc' })
            .ok({ response: { orderby: { direction: 'asc', name: 'name' }, skip, take } })
    })

    // RpcController에서 CommonQueryDto을 처리해야 한다
    it('Should handle CommonQueryDto in RpcController', async () => {
        const skip = 2
        const take = 3
        const input = { orderby: { direction: 'asc', name: 'name' }, skip, take }

        await fix.rpcClient.expect(withTestId('getRpcPagination'), input, {
            response: input
        })
    })

    // orderby 형식이 잘못되었을 때 BadRequest를 반환해야 한다
    it('Should return BadRequest when the orderby format is invalid', async () => {
        await fix.httpClient
            .get('/pagination')
            .query({ orderby: 'wrong' })
            .badRequest(CommonErrors.CommonQuery.FormatInvalid)
    })

    // 정렬 방향이 잘못되었을 때 BadRequest를 반환해야 한다
    it('Should return BadRequest when the sort direction is invalid', async () => {
        await fix.httpClient
            .get('/pagination')
            .query({ orderby: 'name:wrong' })
            .badRequest(CommonErrors.CommonQuery.DirectionInvalid)
    })

    // 'take' 값이 지정된 제한을 초과하면 BadRequest를 반환해야 한다
    it("should return BadRequest when the 'take' value exceeds the specified limit", async () => {
        const take = maxTake + 1

        await fix.httpClient
            .get('/pagination')
            .query({ take })
            .badRequest({ ...CommonErrors.CommonQuery.MaxTakeExceeded, take, maxTake })
    })

    // 'take' 값이 지정되지 않은 경우 기본값이 사용되어야 한다
    it("should use the default value if the 'take' value is not specified", async () => {
        await fix.httpClient
            .get('/pagination')
            .query({})
            .ok({ response: { take: maxTake } })
    })
})
