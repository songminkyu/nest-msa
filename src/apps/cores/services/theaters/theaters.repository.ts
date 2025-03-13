import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { MongooseRepository, QueryBuilder } from 'common'
import { Model } from 'mongoose'
import { MongooseConfig } from 'shared'
import { TheaterCreateDto, TheaterQueryDto, TheaterUpdateDto } from './dtos'
import { Theater } from './models'

@Injectable()
export class TheatersRepository extends MongooseRepository<Theater> {
    constructor(@InjectModel(Theater.name, MongooseConfig.connName) model: Model<Theater>) {
        super(model)
    }

    async createTheater(createDto: TheaterCreateDto) {
        const theater = this.newDocument()
        theater.name = createDto.name
        theater.latlong = createDto.latlong
        theater.seatmap = createDto.seatmap

        return theater.save()
    }

    async updateTheater(theaterId: string, updateDto: TheaterUpdateDto) {
        const theater = await this.getById(theaterId)

        if (updateDto.name) theater.name = updateDto.name
        if (updateDto.latlong) theater.latlong = updateDto.latlong
        if (updateDto.seatmap) theater.seatmap = updateDto.seatmap

        return theater.save()
    }

    async findTheaters(queryDto: TheaterQueryDto) {
        const { name, ...pagination } = queryDto

        const paginated = await this.findWithPagination({
            callback: (helpers) => {
                const builder = new QueryBuilder<Theater>()
                builder.addRegex('name', name)

                const query = builder.build({ allowEmpty: true })

                helpers.setQuery(query)
            },
            pagination
        })

        return paginated
    }
}
