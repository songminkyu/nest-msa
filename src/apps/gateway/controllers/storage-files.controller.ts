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
import { StorageFilesProxy } from 'apps/infrastructures'
import { IsString } from 'class-validator'
import { createReadStream } from 'fs'
import { pick } from 'lodash'
import { Routes } from 'shared'
import { MulterExceptionFilter } from './filters'

class UploadFileDto {
    @IsString()
    name?: string
}

@Controller(Routes.Http.StorageFiles)
export class StorageFilesController {
    constructor(private service: StorageFilesProxy) {}

    @UseFilters(new MulterExceptionFilter())
    @UseInterceptors(FilesInterceptor('files'))
    @Post()
    async saveFiles(@UploadedFiles() files: Express.Multer.File[], @Body() _body: UploadFileDto) {
        const createDtos = files.map((file) =>
            pick(file, 'originalname', 'mimetype', 'size', 'path')
        )

        const storageFiles = await this.service.saveFiles(createDtos)
        return { storageFiles }
    }

    @Get(':fileId')
    async downloadFile(@Param('fileId') fileId: string) {
        const file = await this.service.getStorageFile(fileId)

        const readStream = createReadStream(file.storedPath)

        const stream = new StreamableFile(readStream, {
            type: file.mimetype,
            disposition: `attachment; filename="${encodeURIComponent(file.originalname)}"`,
            length: file.size
        })

        return stream
    }

    @Delete(':fileId')
    async deleteStorageFile(@Param('fileId') fileId: string) {
        return this.service.deleteStorageFile(fileId)
    }
}
