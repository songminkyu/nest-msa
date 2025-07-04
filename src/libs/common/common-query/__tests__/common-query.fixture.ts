import { Controller, Get, Injectable, Query, UsePipes, ValidationPipe } from '@nestjs/common'
import { APP_PIPE } from '@nestjs/core'
import {
    MessagePattern,
    MicroserviceOptions,
    NatsOptions,
    Payload,
    Transport
} from '@nestjs/microservices'
import { CommonQueryDto, CommonQueryPipe } from 'common'
import {
    createHttpTestContext,
    getNatsTestConnection,
    HttpTestClient,
    RpcTestClient,
    withTestId
} from 'testlib'

export const maxTakeValue = 50

@Injectable()
class DefaultCommonQueryPipe extends CommonQueryPipe {
    get maxTake(): number {
        return maxTakeValue
    }
}

@Controller()
class SamplesController {
    @Get('pagination')
    async getPagination(@Query() query: CommonQueryDto) {
        return { response: query }
    }

    @Get('pagination/limited')
    @UsePipes(DefaultCommonQueryPipe)
    async getLimitedPagination(@Query() query: CommonQueryDto) {
        return { response: query }
    }

    @MessagePattern(withTestId('getRpcPagination'))
    getRpcPagination(@Payload() query: CommonQueryDto) {
        return { response: query }
    }
}

export interface Fixture {
    teardown: () => Promise<void>
    httpClient: HttpTestClient
    rpcClient: RpcTestClient
}

export async function createFixture() {
    const { servers } = await getNatsTestConnection()
    const brokerOpts = { transport: Transport.NATS, options: { servers } } as NatsOptions

    const { httpClient, ...testContext } = await createHttpTestContext({
        metadata: {
            controllers: [SamplesController],
            providers: [
                {
                    provide: APP_PIPE,
                    useFactory: () =>
                        new ValidationPipe({
                            transform: true,
                            transformOptions: { enableImplicitConversion: true }
                        })
                }
            ]
        },
        configureApp: async (app) => {
            app.connectMicroservice<MicroserviceOptions>(brokerOpts, { inheritAppConfig: true })
            await app.startAllMicroservices()
        }
    })

    const rpcClient = RpcTestClient.create(brokerOpts)

    const teardown = async () => {
        await rpcClient.close()
        await testContext.close()
    }

    return { teardown, httpClient, rpcClient }
}
