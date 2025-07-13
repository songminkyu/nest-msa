import { Controller, ParseArrayPipe } from '@nestjs/common'
import { MessagePattern, Payload } from '@nestjs/microservices'
import { Messages } from 'shared'
import { CreateStorageFileDto } from './dtos'
import { StorageFilesService } from './storage-files.service'

@Controller()
export class StorageFilesController {
    constructor(private service: StorageFilesService) {}

    @MessagePattern(Messages.StorageFiles.saveFiles)
    saveFiles(
        @Payload(new ParseArrayPipe({ items: CreateStorageFileDto }))
        createDtos: CreateStorageFileDto[]
    ) {
        return this.service.saveFiles(createDtos)
    }

    @MessagePattern(Messages.StorageFiles.getFiles)
    getFiles(@Payload() fileIds: string[]) {
        return this.service.getFiles(fileIds)
    }

    @MessagePattern(Messages.StorageFiles.deleteFiles)
    deleteFiles(@Payload() fileIds: string[]) {
        return this.service.deleteFiles(fileIds)
    }
}
