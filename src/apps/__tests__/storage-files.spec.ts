import { StorageFileDto } from 'apps/infrastructures'
import { generateShortId, getChecksum, Path } from 'common'
import { nullObjectId } from 'testlib'
import { Fixture, saveFile } from './storage-files.fixture'
import { Errors } from './utils'

/* 파일 업로드 테스트 */
describe('File Upload Tests', () => {
    let fix: Fixture

    beforeEach(async () => {
        const { createFixture } = await import('./storage-files.fixture')
        fix = await createFixture()
    })

    afterEach(async () => {
        await fix?.teardown()
    })

    describe('POST /storage-files', () => {
        const uploadFile = (attachs: any[], fields?: any[]) =>
            fix.httpClient
                .post('/storage-files')
                .attachs(attachs)
                .fields(fields ?? [{ name: 'name', value: 'test' }])

        it('업로드된 파일이 저장된 파일과 동일해야 한다', async () => {
            const { body } = await uploadFile([
                { name: 'files', file: fix.files.small.path }
            ]).created()

            expect(body.storageFiles[0].checksum).toEqual(await getChecksum(fix.files.small.path))
        })

        it('여러 파일을 업로드할 수 있어야 한다', async () => {
            const { body } = await uploadFile([
                { name: 'files', file: fix.files.small.path },
                { name: 'files', file: fix.files.large.path }
            ]).created()

            expect(body.storageFiles[0].checksum).toEqual(await getChecksum(fix.files.small.path))
            expect(body.storageFiles[1].checksum).toEqual(await getChecksum(fix.files.large.path))
        })

        it('파일을 첨부하지 않아도 업로드가 성공해야 한다', async () => {
            await uploadFile([]).created()
        })

        it('허용된 크기를 초과하는 파일을 업로드하면 PAYLOAD_TOO_LARGE(413)를 반환해야 한다', async () => {
            await uploadFile([{ name: 'files', file: fix.files.oversized.path }]).payloadTooLarge(
                expect.objectContaining(Errors.FileUpload.MaxSizeExceeded)
            )
        })

        it('허용된 파일 개수를 초과하여 업로드하면 BAD_REQUEST(400)를 반환해야 한다', async () => {
            const limitOver = fix.maxFilesPerUpload + 1
            const excessFiles = Array(limitOver).fill({ name: 'files', file: fix.files.small.path })

            await uploadFile(excessFiles).badRequest(
                expect.objectContaining(Errors.FileUpload.MaxCountExceeded)
            )
        })

        it('허용되지 않는 MIME 타입의 파일을 업로드하면 BAD_REQUEST(400)를 반환해야 한다', async () => {
            await uploadFile([
                { name: 'files', file: fix.files.notAllowed.path }
            ]).unsupportedMediaTypeException({
                ...Errors.FileUpload.InvalidFileType,
                allowedTypes: ['text/plain']
            })
        })

        it('name 필드를 설정하지 않으면 BAD_REQUEST(400)를 반환해야 한다', async () => {
            await uploadFile([], []).badRequest({
                ...Errors.RequestValidation.Failed,
                details: [{ constraints: { isString: 'name must be a string' }, field: 'name' }]
            })
        })
    })

    describe('GET /storage-files/:fileId', () => {
        let uploadedFile: StorageFileDto
        let tempDir: string

        beforeEach(async () => {
            tempDir = await Path.createTempDirectory()

            const { saveFile } = await import('./storage-files.fixture')
            uploadedFile = await saveFile(fix, fix.files.large)
        })

        afterEach(async () => {
            await Path.delete(tempDir)
        })

        it('파일을 다운로드해야 한다', async () => {
            const downloadPath = Path.join(tempDir, generateShortId() + '.txt')

            await fix.httpClient
                .get(`/storage-files/${uploadedFile.id}`)
                .download(downloadPath)
                .ok()

            expect(await Path.getSize(downloadPath)).toEqual(uploadedFile.size)
            expect(await getChecksum(downloadPath)).toEqual(uploadedFile.checksum)
        })

        it('파일이 존재하지 않으면 NOT_FOUND(404)를 반환해야 한다', async () => {
            await fix.httpClient.get(`/storage-files/${nullObjectId}`).notFound({
                ...Errors.Mongoose.MultipleDocumentsNotFound,
                notFoundIds: [nullObjectId]
            })
        })
    })

    describe('DELETE /storage-files/:fileId', () => {
        let uploadedFile: StorageFileDto

        beforeEach(async () => {
            uploadedFile = await saveFile(fix, fix.files.large)
        })

        it('파일을 삭제해야 한다', async () => {
            const filePath = Path.join(fix.uploadDir, `${uploadedFile.id}.file`)

            expect(Path.existsSync(filePath)).toBeTruthy()

            await fix.httpClient.delete(`/storage-files/${uploadedFile.id}`).ok()
            await fix.httpClient.get(`/storage-files/${uploadedFile.id}`).notFound({
                ...Errors.Mongoose.MultipleDocumentsNotFound,
                notFoundIds: [uploadedFile.id]
            })

            expect(Path.existsSync(filePath)).toBeFalsy()
        })

        it('파일이 존재하지 않으면 NOT_FOUND(404)를 반환해야 한다', async () => {
            await fix.httpClient.delete(`/storage-files/${nullObjectId}`).notFound({
                ...Errors.Mongoose.MultipleDocumentsNotFound,
                notFoundIds: [nullObjectId]
            })
        })
    })
})
