import { Injectable } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { BaseConfigService } from 'common'
import Joi from 'joi'
import { createTestingModule } from 'testlib'

const configSchema = Joi.object({
    TEST_STRING_KEY: Joi.string().required(),
    TEST_NUMBER_KEY: Joi.number().required()
})

@Injectable()
export class AppConfigService extends BaseConfigService {
    constructor(configService: ConfigService) {
        super(configService)
    }

    getTestString() {
        return this.getString('TEST_STRING_KEY')
    }

    getTestNumber() {
        return this.getNumber('TEST_NUMBER_KEY')
    }

    throwError() {
        return this.getString('TEST_NOT_EXIST_KEY')
    }
}

export interface Fixture {
    teardown: () => Promise<void>
    appConfigService: AppConfigService
}

export async function createFixture() {
    process.env['TEST_STRING_KEY'] = 'value'
    process.env['TEST_NUMBER_KEY'] = '123'

    const module = await createTestingModule({
        imports: [ConfigModule.forRoot({ validationSchema: configSchema })],
        providers: [AppConfigService]
    })

    const appConfigService = module.get(AppConfigService)

    const teardown = async () => {
        await module?.close()
    }

    return { teardown, appConfigService }
}
