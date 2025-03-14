import { Controller, Get } from '@nestjs/common'
import { APP_INTERCEPTOR } from '@nestjs/core'
import { HttpSuccessInterceptor } from 'common'
import { createHttpTestContext, HttpTestClient } from 'testlib'

@Controller()
class TestController {
    @Get()
    async responseSuccess() {}
}

export interface Fixture {
    teardown: () => Promise<void>
    httpClient: HttpTestClient
    spyVerbose: jest.SpyInstance
}

export async function createFixture() {
    const { httpClient, ...testContext } = await createHttpTestContext({
        metadata: {
            controllers: [TestController],
            providers: [{ provide: APP_INTERCEPTOR, useClass: HttpSuccessInterceptor }]
        }
    })

    const { Logger } = await import('@nestjs/common')
    const spyVerbose = jest.spyOn(Logger, 'verbose').mockImplementation(() => {})

    const teardown = async () => {
        await testContext?.close()
    }

    return { teardown, spyVerbose, httpClient }
}
