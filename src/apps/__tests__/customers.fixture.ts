import { CustomerJwtAuthGuard } from 'apps/gateway'
import { CommonFixture, createCommonFixture } from './helpers'

export interface Fixture extends CommonFixture {
    teardown: () => Promise<void>
}

export const createFixture = async () => {
    const commonFixture = await createCommonFixture({
        gateway: { ignoreGuards: [CustomerJwtAuthGuard] }
    })

    const teardown = async () => {
        await commonFixture?.close()
    }

    return { ...commonFixture, teardown }
}
