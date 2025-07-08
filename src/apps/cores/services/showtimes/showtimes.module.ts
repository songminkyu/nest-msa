import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { MongooseConfigModule } from 'shared'
import { Showtime, ShowtimeSchema } from './models'
import { ShowtimesController } from './showtimes.controller'
import { ShowtimesRepository } from './showtimes.repository'
import { ShowtimesService } from './showtimes.service'

@Module({
    imports: [
        MongooseModule.forFeature(
            [{ name: Showtime.name, schema: ShowtimeSchema }],
            MongooseConfigModule.connectionName
        )
    ],
    providers: [ShowtimesService, ShowtimesRepository],
    controllers: [ShowtimesController]
})
export class ShowtimesModule {}
