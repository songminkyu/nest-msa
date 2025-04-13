import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { MongooseRepository, QueryBuilder, QueryBuilderOptions } from 'common'
import { Model } from 'mongoose'
import { TheaterCreateDto, TheaterQueryDto, TheaterUpdateDto } from './dtos'
import { Theater } from './models'

@Injectable()
export class TheatersRepository extends MongooseRepository<Theater> {
    constructor(@InjectModel(Theater.name) model: Model<Theater>) {
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
        const { take, skip, orderby } = queryDto

        const paginated = await this.findWithPagination({
            callback: (helpers) => {
                const query = this.buildQuery(queryDto, { allowEmpty: true })

                helpers.setQuery(query)
            },
            pagination: { take, skip, orderby }
        })

        return paginated
    }

    private buildQuery(queryDto: TheaterQueryDto, options: QueryBuilderOptions) {
        const { name } = queryDto

        const builder = new QueryBuilder<Theater>()
        builder.addRegex('name', name)

        const query = builder.build(options)
        return query
    }
}
