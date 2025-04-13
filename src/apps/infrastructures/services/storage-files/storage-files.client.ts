import { Injectable } from '@nestjs/common'
import { ClientProxyService, DeleteResult, InjectClientProxy } from 'common'
import { Messages } from 'shared'
import { StorageFileCreateDto, StorageFileDto } from './dtos'

@Injectable()
export class StorageFilesClient {
    constructor(@InjectClientProxy() private proxy: ClientProxyService) {}

    saveFiles(createDtos: StorageFileCreateDto[]): Promise<StorageFileDto[]> {
        return this.proxy.getJson(Messages.StorageFiles.saveFiles, createDtos)
    }

    getFiles(fileIds: string[]): Promise<StorageFileDto[]> {
        return this.proxy.getJson(Messages.StorageFiles.getFiles, fileIds)
    }

    deleteFiles(fileIds: string[]): Promise<DeleteResult> {
        return this.proxy.getJson(Messages.StorageFiles.deleteFiles, fileIds)
    }
}
