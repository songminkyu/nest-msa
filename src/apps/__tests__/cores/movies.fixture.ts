import { CommonFixture, createCommonFixture, TestFile, TestFiles } from '../helpers'

export interface Fixture extends CommonFixture {
    teardown: () => Promise<void>
    image: TestFile
}

export const createFixture = async () => {
    const commonFixture = await createCommonFixture()

    const teardown = async () => {
        await commonFixture?.close()
    }

    return { ...commonFixture, teardown, image: TestFiles.image }
}
