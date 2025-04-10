import { CommonFixture, createCommonFixture, TestFile, TestFiles } from './utils'

export interface Fixture extends CommonFixture {
    teardown: () => Promise<void>
    image: TestFile
}

export async function createFixture() {
    const commonFixture = await createCommonFixture()

    const teardown = async () => {
        await commonFixture?.close()
    }

    return { ...commonFixture, teardown, image: TestFiles.image }
}
