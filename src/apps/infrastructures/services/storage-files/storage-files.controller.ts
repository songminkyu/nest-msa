import { Controller, ParseArrayPipe } from '@nestjs/common'
import { MessagePattern, Payload } from '@nestjs/microservices'
import { Messages } from 'shared'
import { StorageFileCreateDto } from './dtos'
import { StorageFilesService } from './storage-files.service'

@Controller()
export class StorageFilesController {
    constructor(private service: StorageFilesService) {}

    @MessagePattern(Messages.StorageFiles.saveFiles)
    saveFiles(
        @Payload(new ParseArrayPipe({ items: StorageFileCreateDto }))
        createDtos: StorageFileCreateDto[]
    ) {
        return this.service.saveFiles(createDtos)
    }

    @MessagePattern(Messages.StorageFiles.getFile)
    getStorageFile(@Payload() fileId: string) {
        return this.service.getFile(fileId)
    }

    @MessagePattern(Messages.StorageFiles.deleteFiles)
    deleteStorageFile(@Payload() fileIds: string[]) {
        return this.service.deleteFiles(fileIds)
    }
}
