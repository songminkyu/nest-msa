import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { MongooseRepository } from 'common'
import { ClientSession, Model } from 'mongoose'
import { MongooseConfigModule } from 'shared'
import { CreateStorageFileDto } from './dtos'
import { StorageFile } from './models'

@Injectable()
export class StorageFilesRepository extends MongooseRepository<StorageFile> {
    constructor(
        @InjectModel(StorageFile.name, MongooseConfigModule.connectionName)
        model: Model<StorageFile>
    ) {
        super(model, MongooseConfigModule.maxTake)
    }

    async createStorageFile(
        createDto: CreateStorageFileDto,
        checksum: string,
        session?: ClientSession
    ) {
        const storageFile = this.newDocument()
        storageFile.originalName = createDto.originalName
        storageFile.mimeType = createDto.mimeType
        storageFile.size = createDto.size
        storageFile.checksum = checksum

        return storageFile.save({ session })
    }
}
