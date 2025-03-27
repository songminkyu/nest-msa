import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { PassportModule } from '@nestjs/passport'
import { DateUtil, JwtAuthModule } from 'common'
import { AppConfigService, ProjectName, uniqueWhenTesting } from 'shared'
import { CustomersController } from './customers.controller'
import { CustomersRepository } from './customers.repository'
import { CustomersService } from './customers.service'
import { Customer, CustomerSchema } from './models'

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Customer.name, schema: CustomerSchema }]),
        PassportModule,
        JwtAuthModule.register({
            name: 'customer',
            prefix: `jwtauth:${uniqueWhenTesting(ProjectName)}`,
            useFactory: ({ auth }: AppConfigService) => ({
                auth: {
                    accessSecret: auth.accessSecret,
                    accessTokenTtlMs: DateUtil.toMs(auth.accessTokenExpiration),
                    refreshSecret: auth.refreshSecret,
                    refreshTokenTtlMs: DateUtil.toMs(auth.refreshTokenExpiration)
                }
            }),
            inject: [AppConfigService]
        })
    ],
    providers: [CustomersService, CustomersRepository],
    controllers: [CustomersController]
})
export class CustomersModule {}
