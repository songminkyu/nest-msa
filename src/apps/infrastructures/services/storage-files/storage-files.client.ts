import { Injectable } from '@nestjs/common'
import { ClientProxyService, InjectClientProxy } from 'common'
import { Messages } from 'shared'
import { StorageFileCreateDto, StorageFileDto } from './dtos'

@Injectable()
export class StorageFilesClient {
    constructor(@InjectClientProxy() private service: ClientProxyService) {}

    saveFiles(createDtos: StorageFileCreateDto[]): Promise<StorageFileDto[]> {
        return this.service.getJson(Messages.StorageFiles.saveFiles, createDtos)
    }

    getStorageFile(fileId: string): Promise<StorageFileDto> {
        return this.service.getJson(Messages.StorageFiles.getStorageFile, fileId)
    }

    deleteStorageFiles(fileIds: string[]): Promise<boolean> {
        return this.service.getJson(Messages.StorageFiles.deleteStorageFiles, fileIds)
    }
}
