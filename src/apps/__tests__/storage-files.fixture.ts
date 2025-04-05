import { Path } from 'common'
import { HttpTestClient } from 'testlib'
import { AllTestContexts, createAllTestContexts, TestFile, TestFiles } from './utils'
import { AllProviders } from './utils/clients'

export async function saveFile(testContext: AllTestContexts, file: TestFile) {
    // 좀 더 범용적으로 고쳐라
    const files = await testContext.providers.storageFilesClient.saveFiles([
        { originalname: 'large.txt', mimetype: 'text/plain', ...file }
    ])

    return files[0]
}

// TODO AllProviders => CommonFixture?
export interface Fixture extends AllProviders {
    testContext: AllTestContexts
    teardown: () => Promise<void>
    httpClient: HttpTestClient
    uploadDir: string
    maxFileSizeBytes: number
    maxFilesPerUpload: number
    files: { notAllowed: TestFile; oversized: TestFile; large: TestFile; small: TestFile }
}

export async function createFixture() {
    const files = {
        notAllowed: TestFiles.json,
        oversized: TestFiles.oversized,
        large: TestFiles.large,
        small: TestFiles.small
    }
    const uploadDir = await Path.createTempDirectory()
    const maxFileSizeBytes = files.oversized.size
    const maxFilesPerUpload = 2

    const testContext = await createAllTestContexts({
        gateway: {
            config: {
                FILE_UPLOAD_DIRECTORY: uploadDir,
                FILE_UPLOAD_MAX_FILE_SIZE_BYTES: maxFileSizeBytes,
                FILE_UPLOAD_MAX_FILES_PER_UPLOAD: maxFilesPerUpload,
                FILE_UPLOAD_ALLOWED_FILE_TYPES: 'text/plain'
            }
        },
        infras: { config: { FILE_UPLOAD_DIRECTORY: uploadDir } }
    })

    const teardown = async () => {
        await testContext?.close()
        await Path.delete(uploadDir)
    }

    return {
        ...testContext.providers,
        testContext,
        teardown,
        httpClient: testContext.gatewayContext.httpClient,
        uploadDir,
        maxFileSizeBytes,
        maxFilesPerUpload,
        files
    }
}
