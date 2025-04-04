import { AllTestContexts, TestFile } from './utils'

export async function saveFile(testContext: AllTestContexts, file: TestFile) {
    const files = await testContext.providers.storageFilesClient.saveFiles([
        { originalname: 'large.txt', mimetype: 'text/plain', ...file }
    ])

    return files[0]
}
