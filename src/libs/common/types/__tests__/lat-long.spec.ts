import { LatLong } from 'common'
import { HttpTestClient } from 'testlib'

describe('LatLong', () => {
    let teardown = () => {}
    let client: HttpTestClient

    beforeEach(async () => {
        const { createFixture } = await import('./lat-long.fixture')

        const fixture = await createFixture()
        teardown = fixture.teardown
        client = fixture.client
    })

    afterEach(async () => {
        await teardown()
    })

    it('두 위경도 간의 거리를 미터 단위로 계산해야 한다', () => {
        // 서울의 위경도
        const seoul: LatLong = {
            latitude: 37.5665,
            longitude: 126.978
        }

        // 부산의 위경도
        const busan: LatLong = {
            latitude: 35.1796,
            longitude: 129.0756
        }

        // 서울과 부산 사이의 대략적인 거리 (약 325km)
        const expectedDistance = 325000

        // 함수로부터 실제 거리를 구함
        const actualDistance = LatLong.distanceInMeters(seoul, busan)

        // 오차 범위(5%)를 설정
        const tolerance = 0.05 * expectedDistance

        // 실제 거리가 예상 범위 내에 있는지 확인
        expect(actualDistance).toBeGreaterThan(expectedDistance - tolerance)
        expect(actualDistance).toBeLessThan(expectedDistance + tolerance)
    })

    it('유효한 위경도를 파싱해야 한다', async () => {
        const res = await client.get('/latlong').query({ location: '37.123,128.678' }).ok()

        expect(res.body).toEqual({ latitude: 37.123, longitude: 128.678 })
    })

    it('latlong 값이 없으면 BadRequestException을 발생시켜야 한다', async () => {
        return client.get('/latlong').badRequest()
    })

    it('잘못된 형식인 경우 BadRequestException을 발생시켜야 한다', async () => {
        return client.get('/latlong').query({ location: '37.123' }).badRequest()
    })

    it('범위를 벗어난 값인 경우 BadRequestException을 발생시켜야 한다', async () => {
        return client.get('/latlong').query({ location: '91,181' }).badRequest()
    })
})
