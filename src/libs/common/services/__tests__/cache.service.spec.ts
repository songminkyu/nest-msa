import { sleep } from 'common'
import type { Fixture } from './cache.service.fixture'

describe('CacheService', () => {
    let fix: Fixture

    beforeEach(async () => {
        const { createFixture } = await import('./cache.service.fixture')
        fix = await createFixture()
    })

    afterEach(async () => {
        await fix?.teardown()
    })

    it('캐시에 값을 설정해야 한다', async () => {
        await fix.cacheService.set('key', 'value')
        const cachedValue = await fix.cacheService.get('key')

        expect(cachedValue).toEqual('value')
    })

    it('캐시에 값을 설정할 때 TTL을 지정할 수 있어야 한다', async () => {
        const ttl = 1000
        await fix.cacheService.set('key', 'value', ttl)

        const beforeExpiration = await fix.cacheService.get('key')
        expect(beforeExpiration).toEqual('value')

        await sleep(ttl * 1.1)

        const afterExpiration = await fix.cacheService.get('key')
        expect(afterExpiration).toBeNull()
    })

    it('TTL이 0이면 만료되지 않아야 한다', async () => {
        const ttl = 0
        await fix.cacheService.set('key', 'value', ttl)

        const beforeExpiration = await fix.cacheService.get('key')
        expect(beforeExpiration).toEqual('value')

        await sleep(1000)

        const afterExpiration = await fix.cacheService.get('key')
        expect(afterExpiration).toEqual('value')
    })

    it('TTL이 0 미만이면 예외를 던져야 한다', async () => {
        const wrongTTL = -100

        await expect(fix.cacheService.set('key', 'value', wrongTTL)).rejects.toThrow(
            'TTL must be a non-negative integer (0 for no expiration)'
        )
    })

    it('캐시에서 값을 삭제해야 한다', async () => {
        await fix.cacheService.set('key', 'value')

        const beforeDelete = await fix.cacheService.get('key')
        expect(beforeDelete).toEqual('value')

        await fix.cacheService.delete('key')

        const afterDelete = await fix.cacheService.get('key')
        expect(afterDelete).toBeNull()
    })

    it('Lua 스크립트를 실행해야 한다', async () => {
        const script = `return redis.call('SET', KEYS[1], ARGV[2])`
        const keys = ['key']
        const args = ['value']

        const result = await fix.cacheService.executeScript(script, keys, args)
        expect(result).toBe('OK')

        const storedValue = await fix.cacheService.get('key')
        expect(storedValue).toBe('value')
    })
})
