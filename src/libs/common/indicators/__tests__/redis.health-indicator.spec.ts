import type { Fixture } from './redis.health-indicator.fixture'

describe('RedisHealthIndicator', () => {
    let fix: Fixture

    beforeEach(async () => {
        const { createFixture } = await import('./redis.health-indicator.fixture')
        fix = await createFixture()
    })

    afterEach(async () => {
        await fix?.teardown()
    })

    /* 반환값이 'PONG'이면 up 상태이다 */
    it('should be in the "up" state if the response is "PONG"', async () => {
        const res = await fix.redisIndicator.isHealthy('key', fix.redis)
        expect(res).toEqual({ key: { status: 'up' } })
    })

    /* 반환값이 'PONG'이 아니면 down 상태이다 */
    it('should be in the "down" state if the response is not "PONG"', async () => {
        jest.spyOn(fix.redis, 'ping').mockResolvedValueOnce('INVALID_RESPONSE')

        const res = await fix.redisIndicator.isHealthy('key', fix.redis)
        expect(res).toEqual({
            key: {
                status: 'down',
                reason: 'Redis ping returned unexpected response: INVALID_RESPONSE'
            }
        })
    })

    /* 예외가 발생하면 down 상태이다 */
    it('should be in the "down" state if an exception occurs', async () => {
        jest.spyOn(fix.redis, 'ping').mockRejectedValueOnce(new Error('error'))

        const res = await fix.redisIndicator.isHealthy('key', fix.redis)
        expect(res).toEqual({ key: { status: 'down', reason: 'error' } })
    })

    /* 예외 발생 시 message가 없으면 error를 그대로 반환해야 한다 */
    it('should return the raw error if it has no message', async () => {
        jest.spyOn(fix.redis, 'ping').mockRejectedValueOnce('unknown error')

        const res = await fix.redisIndicator.isHealthy('key', fix.redis)
        expect(res).toEqual({ key: { status: 'down', reason: 'unknown error' } })
    })
})
