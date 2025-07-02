import { Controller, Get } from '@nestjs/common'
import { LatLong, LatLongQuery } from 'common'
import { createHttpTestContext, HttpTestClient } from 'testlib'

@Controller()
class TestController {
    @Get('latLong')
    async testLatLong(@LatLongQuery('location') latLong: LatLong) {
        return latLong
    }
}

export interface Fixture {
    teardown: () => Promise<void>
    httpClient: HttpTestClient
}

export async function createFixture() {
    const { httpClient, ...testContext } = await createHttpTestContext({
        metadata: { controllers: [TestController] }
    })

    const teardown = async () => {
        await testContext?.close()
    }

    return { teardown, httpClient }
}
