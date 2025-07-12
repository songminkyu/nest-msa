import { Module } from '@nestjs/common'
import { getConnectionToken, MongooseModule } from '@nestjs/mongoose'
import { AppConfigService, makeName } from '../config'

@Module({
    imports: [
        MongooseModule.forRootAsync({
            connectionName: MongooseConfigModule.connectionName,
            useFactory: async (config: AppConfigService) => {
                const { user, password, host1, host2, host3, port, replica, database } =
                    config.mongo
                const uri = `mongodb://${user}:${password}@${host1}:${port},${host2}:${port},${host3}:${port}/?replicaSet=${replica}`
                const dbName = makeName(database)

                return {
                    uri,
                    dbName,
                    waitQueueTimeoutMS: 5000,
                    writeConcern: { w: 'majority', journal: true, wtimeoutMS: 5000 },
                    bufferCommands: true,
                    autoIndex: false,
                    autoCreate: false
                }
            },
            inject: [AppConfigService]
        })
    ]
})
export class MongooseConfigModule {
    static get moduleName() {
        return getConnectionToken(this.connectionName)
    }

    static get connectionName() {
        return 'mongo-connection'
    }
}
