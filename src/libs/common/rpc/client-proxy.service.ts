import {
    DynamicModule,
    Global,
    HttpException,
    Inject,
    Injectable,
    Module,
    OnModuleDestroy
} from '@nestjs/common'
import { ClientProvider, ClientProxy, ClientsModule } from '@nestjs/microservices'
import { catchError, lastValueFrom, Observable } from 'rxjs'
import { jsonToObject } from '../utils'

async function waitProxyValue<T>(observer: Observable<T>): Promise<T> {
    return lastValueFrom(
        observer.pipe(
            catchError((error) => {
                const { status, response, options, message } = error

                if (status && response) {
                    throw new HttpException(response, status, options)
                } else {
                    throw new Error(message)
                }
            })
        )
    )
}

async function getProxyValue<T>(observer: Observable<T>): Promise<T> {
    return jsonToObject(await waitProxyValue(observer))
}

@Injectable()
export class ClientProxyService implements OnModuleDestroy {
    constructor(private proxy: ClientProxy) {}

    static getToken(name?: string) {
        return `ClientProxyService_${name}`
    }

    async onModuleDestroy() {
        await this.proxy.close()
    }

    getJson<T>(cmd: string, payload: any): Promise<T> {
        const observable = this.send<T>(cmd, payload)
        return getProxyValue(observable)
    }

    send<T>(cmd: string, payload: any): Observable<T> {
        // payload는 null을 허용하지 않음
        return this.proxy.send(cmd, payload ?? '')
    }

    emit(event: string, payload: any): Promise<void> {
        // payload는 null을 허용하지 않음
        return waitProxyValue(this.proxy.emit<void>(event, payload ?? ''))
    }
}

export function InjectClientProxy(name?: string): ParameterDecorator {
    return Inject(ClientProxyService.getToken(name))
}

export interface ClientProxyModuleOptions {
    name?: string
    useFactory?: (...args: any[]) => Promise<ClientProvider> | ClientProvider
    inject?: any[]
}

@Global()
@Module({})
export class ClientProxyModule {
    static registerAsync(options: ClientProxyModuleOptions): DynamicModule {
        const { name, useFactory, inject } = options

        const clientName = name ?? 'DefaultClientProxy'

        const provider = {
            provide: ClientProxyService.getToken(name),
            useFactory: async (proxy: ClientProxy) => {
                return new ClientProxyService(proxy)
            },
            inject: [clientName]
        }

        return {
            module: ClientProxyModule,
            imports: [ClientsModule.registerAsync([{ name: clientName, useFactory, inject }])],
            providers: [provider],
            exports: [provider]
        }
    }
}
