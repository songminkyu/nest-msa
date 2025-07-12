import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { PassportModule } from '@nestjs/passport'
import { JwtAuthModule, Time } from 'common'
import {
    AppConfigService,
    MongooseConfigModule,
    ProjectName,
    RedisConfigModule,
    makeName
} from 'shared'
import { CustomersController } from './customers.controller'
import { CustomersRepository } from './customers.repository'
import { CustomersService } from './customers.service'
import { Customer, CustomerSchema } from './models'
import { CustomerAuthenticationService } from './services'

@Module({
    imports: [
        MongooseModule.forFeature(
            [{ name: Customer.name, schema: CustomerSchema }],
            MongooseConfigModule.connectionName
        ),
        PassportModule,
        JwtAuthModule.register({
            redisName: RedisConfigModule.connectionName,
            prefix: `jwtauth:${makeName(ProjectName)}`,
            useFactory: ({ auth }: AppConfigService) => ({
                auth: {
                    accessSecret: auth.accessSecret,
                    accessTokenTtlMs: Time.toMs(auth.accessTokenExpiration),
                    refreshSecret: auth.refreshSecret,
                    refreshTokenTtlMs: Time.toMs(auth.refreshTokenExpiration)
                }
            }),
            inject: [AppConfigService]
        })
    ],
    providers: [CustomersService, CustomerAuthenticationService, CustomersRepository],
    controllers: [CustomersController]
})
export class CustomersModule {}
