import { Controller, Get, MessageEvent, Sse } from '@nestjs/common'
import { EventPattern, MessagePattern, NatsOptions, Transport } from '@nestjs/microservices'
import { ClientProxyModule, ClientProxyService, InjectClientProxy } from 'common'
import { Observable, Subject } from 'rxjs'
import {
    createHttpTestContext,
    getNatsTestConnection,
    HttpTestClient,
    RpcTestClient,
    withTestId
} from 'testlib'

@Controller()
class SendTestController {
    constructor(@InjectClientProxy('name') private client: ClientProxyService) {}

    @MessagePattern(withTestId('subject.method'))
    method() {
        return { result: 'success' }
    }

    @Get('observable')
    getObservable() {
        return this.client.send(withTestId('subject.method'), {})
    }

    @Get('value')
    getValue() {
        return this.client.getJson(withTestId('subject.method'), {})
    }
}

@Controller()
class EmitTestController {
    private eventSubject = new Subject<MessageEvent>()

    constructor(@InjectClientProxy('name') private client: ClientProxyService) {}

    @EventPattern(withTestId('subject.emitEvent'))
    async handleEvent(data: any) {
        this.eventSubject.next({ data })
        this.eventSubject.complete()
    }

    @Sse('handle-event')
    observeEvent(): Observable<MessageEvent> {
        return this.eventSubject.asObservable()
    }
}

export interface Fixture {
    teardown: () => Promise<void>
    rpcClient: RpcTestClient
    httpClient: HttpTestClient
}

export async function createFixture() {
    const { servers } = getNatsTestConnection()
    const brokerOptions = { transport: Transport.NATS, options: { servers } } as NatsOptions

    const testContext = await createHttpTestContext({
        metadata: {
            imports: [
                ClientProxyModule.registerAsync({ name: 'name', useFactory: () => brokerOptions })
            ],
            controllers: [SendTestController, EmitTestController]
        },
        configureApp: async (app) => {
            app.connectMicroservice(brokerOptions, { inheritAppConfig: true })
            await app.startAllMicroservices()
        }
    })

    const rpcClient = RpcTestClient.create(brokerOptions)

    const teardown = async () => {
        await rpcClient.close()
        await testContext.close()
    }

    return { testContext, teardown, httpClient: testContext.httpClient, rpcClient }
}
