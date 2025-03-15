import { Controller, Get, NotFoundException, ValidationPipe } from '@nestjs/common'
import { APP_FILTER, APP_PIPE } from '@nestjs/core'
import { MessagePattern, MicroserviceOptions, NatsOptions, Transport } from '@nestjs/microservices'
import { IsNotEmpty, IsString } from 'class-validator'
import {
    createHttpTestContext,
    getNatsTestConnection,
    HttpTestClient,
    RpcTestClient,
    withTestId
} from 'testlib'
import { RpcExceptionFilter } from '../rpc-exception.filter'

class CreateSampleDto {
    @IsString()
    @IsNotEmpty()
    name: string
}

@Controller()
class SampleController {
    constructor() {}

    @MessagePattern(withTestId('subject.throwHttpException'))
    throwHttpException() {
        throw new NotFoundException('not found exception')
    }

    @MessagePattern(withTestId('subject.throwError'))
    throwError() {
        throw new Error('error message')
    }

    @MessagePattern(withTestId('subject.verifyDto'))
    verifyDto(createDto: CreateSampleDto) {
        return createDto
    }

    @Get('throwHttpException')
    getThrowHttpException() {
        throw new NotFoundException('not found exception')
    }
}

export interface Fixture {
    teardown: () => Promise<void>
    rpcClient: RpcTestClient
    httpClient: HttpTestClient
}

export async function createFixture() {
    const { servers } = await getNatsTestConnection()
    const brokerOptions = { transport: Transport.NATS, options: { servers } } as NatsOptions

    const { httpClient, ...testContext } = await createHttpTestContext({
        metadata: {
            controllers: [SampleController],
            providers: [
                { provide: APP_PIPE, useFactory: () => new ValidationPipe() },
                { provide: APP_FILTER, useClass: RpcExceptionFilter }
            ]
        },
        configureApp: async (app) => {
            app.connectMicroservice<MicroserviceOptions>(brokerOptions, { inheritAppConfig: true })
            await app.startAllMicroservices()
        }
    })

    const rpcClient = RpcTestClient.create(brokerOptions)

    const teardown = async () => {
        await rpcClient.close()
        await testContext.close()
    }

    return { teardown, httpClient, rpcClient }
}
