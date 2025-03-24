import { Global, Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core'
import { Transport } from '@nestjs/microservices'
import {
    AppLoggerService,
    ClientProxyModule,
    createWinstonLogger,
    ExceptionLoggerFilter,
    SuccessLoggingInterceptor
} from 'common'
import { AppConfigService, ClientProxyConfig, configSchema, ProjectName } from '../config'
import { RequestValidationPipe } from '../pipes/request-validation.pipe'

@Global()
@Module({
    imports: [
        ConfigModule.forRoot({
            cache: true,
            ignoreEnvFile: true,
            validationSchema: configSchema,
            validationOptions: { abortEarly: false }
        }),
        ClientProxyModule.registerAsync({
            name: ClientProxyConfig.connName,
            useFactory: async (config: AppConfigService) => {
                const { servers } = config.nats
                return {
                    transport: Transport.NATS,
                    options: { servers, queue: ProjectName }
                }
            },
            inject: [AppConfigService]
        })
    ],
    providers: [
        AppConfigService,
        { provide: APP_PIPE, useClass: RequestValidationPipe },
        { provide: APP_FILTER, useClass: ExceptionLoggerFilter },
        { provide: APP_INTERCEPTOR, useClass: SuccessLoggingInterceptor },
        {
            provide: AppLoggerService,
            useFactory: (config: AppConfigService) => {
                const loggerInstance = createWinstonLogger(config.log)
                return new AppLoggerService(loggerInstance)
            },
            inject: [AppConfigService]
        }
    ],
    exports: [AppConfigService, ClientProxyModule]
})
export class CommonModule {}
