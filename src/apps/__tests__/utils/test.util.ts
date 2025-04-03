import { getRedisConnectionToken } from '@nestjs-modules/ioredis'
import { Type } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ApplicationsModule, configureApplications } from 'apps/applications'
import { configureCores, CoresModule } from 'apps/cores'
import { configureGateway, GatewayModule } from 'apps/gateway'
import { configureInfrastructures, InfrastructuresModule } from 'apps/infrastructures'
import {
    createHttpTestContext,
    createTestContext,
    getNatsTestConnection,
    HttpTestContext,
    ModuleMetadataEx,
    TestContext
} from 'testlib'

function createConfigServiceMock(mockValues: Record<string, any>) {
    const realConfigService = new ConfigService()

    return {
        original: ConfigService,
        replacement: {
            get: jest.fn((key: string) =>
                key in mockValues ? mockValues[key] : realConfigService.get(key)
            )
        }
    }
}

type TestContextOpts = ModuleMetadataEx & { config?: Record<string, any> }

function createMetadata(module: Type<any>, metadata: TestContextOpts = {}): ModuleMetadataEx {
    const { ignoreGuards, ignoreProviders, overrideProviders, config } = metadata
    const configMock = createConfigServiceMock({ ...config })

    return {
        imports: [module],
        ignoreProviders,
        ignoreGuards,
        overrideProviders: [configMock, ...(overrideProviders ?? [])]
    }
}

export class AllTestContexts {
    gatewayContext: HttpTestContext
    appsContext: TestContext
    coresContext: TestContext
    infrasContext: TestContext
    close: () => Promise<void>
}

export async function createAllTestContexts({
    http,
    apps,
    cores,
    infras
}: {
    http?: TestContextOpts
    apps?: TestContextOpts
    cores?: TestContextOpts
    infras?: TestContextOpts
} = {}): Promise<AllTestContexts> {
    const { servers: brokers } = await getNatsTestConnection()

    const infrasContext = await createTestContext({
        metadata: createMetadata(InfrastructuresModule, infras),
        brokers,
        configureApp: configureInfrastructures
    })

    const coresContext = await createTestContext({
        metadata: createMetadata(CoresModule, cores),
        brokers,
        configureApp: configureCores
    })

    const appsContext = await createTestContext({
        metadata: createMetadata(ApplicationsModule, apps),
        brokers,
        configureApp: configureApplications
    })

    const gatewayContext = await createHttpTestContext({
        metadata: createMetadata(GatewayModule, http),
        brokers,
        configureApp: configureGateway
    })

    const close = async () => {
        const redisToken = getRedisConnectionToken()

        await gatewayContext.close()

        await appsContext.close()
        const appsRedis = appsContext.module.get(redisToken)
        await appsRedis.quit()

        await coresContext.close()
        const coresRedis = coresContext.module.get(redisToken)
        await coresRedis.quit()

        await infrasContext.close()
    }

    return {
        gatewayContext,
        appsContext,
        coresContext,
        infrasContext,
        close
    }
}
// TODO 모든 client를 export 하는 모듈이 필요할지도 모른다.
