import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    StreamableFile,
    UploadedFiles,
    UseFilters,
    UseInterceptors
} from '@nestjs/common'
import { FilesInterceptor } from '@nestjs/platform-express'
import { StorageFilesClient } from 'apps/infrastructures'
import { IsString } from 'class-validator'
import { createReadStream } from 'fs'
import { Routes } from 'shared'
import { MulterExceptionFilter } from './filters'

class UploadFileDto {
    @IsString()
    name?: string
}

@Controller(Routes.Http.StorageFiles)
export class StorageFilesController {
    constructor(private storageFilesService: StorageFilesClient) {}

    @UseFilters(new MulterExceptionFilter())
    @UseInterceptors(FilesInterceptor('files'))
    @Post()
    async saveFiles(@UploadedFiles() files: Express.Multer.File[], @Body() _body: UploadFileDto) {
        const fileCreateDtos = files.map((file) => ({
            originalName: file.originalname,
            mimeType: file.mimetype,
            size: file.size,
            path: file.path
        }))

        const storageFiles = await this.storageFilesService.saveFiles(fileCreateDtos)
        return { storageFiles }
    }

    @Get(':fileId')
    async downloadFile(@Param('fileId') fileId: string) {
        const files = await this.storageFilesService.getFiles([fileId])
        const file = files[0]

        const readStream = createReadStream(file.storedPath)

        const stream = new StreamableFile(readStream, {
            type: file.mimeType,
            disposition: `attachment; filename="${encodeURIComponent(file.originalName)}"`,
            length: file.size
        })

        return stream
    }

    @Delete(':fileId')
    async deleteFile(@Param('fileId') fileId: string) {
        return this.storageFilesService.deleteFiles([fileId])
    }
}
