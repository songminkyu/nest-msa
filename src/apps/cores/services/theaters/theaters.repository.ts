import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { MongooseRepository, QueryBuilder, QueryBuilderOptions } from 'common'
import { Model } from 'mongoose'
import { CreateTheaterDto, SearchTheatersDto, UpdateTheaterDto } from './dtos'
import { Theater } from './models'

@Injectable()
export class TheatersRepository extends MongooseRepository<Theater> {
    constructor(@InjectModel(Theater.name) model: Model<Theater>) {
        super(model)
    }

    async createTheater(createDto: CreateTheaterDto) {
        const theater = this.newDocument()
        theater.name = createDto.name
        theater.location = createDto.location
        theater.seatmap = createDto.seatmap

        return theater.save()
    }

    async updateTheater(theaterId: string, updateDto: UpdateTheaterDto) {
        const theater = await this.getById(theaterId)

        if (updateDto.name) theater.name = updateDto.name
        if (updateDto.location) theater.location = updateDto.location
        if (updateDto.seatmap) theater.seatmap = updateDto.seatmap

        return theater.save()
    }

    async searchTheatersPage(searchDto: SearchTheatersDto) {
        const { take, skip, orderby } = searchDto

        const paginated = await this.findWithPagination({
            handleQuery: (helpers) => {
                const query = this.buildQuery(searchDto, { allowEmpty: true })

                helpers.setQuery(query)
            },
            pagination: { take, skip, orderby }
        })

        return paginated
    }

    private buildQuery(searchDto: SearchTheatersDto, options: QueryBuilderOptions) {
        const { name } = searchDto

        const builder = new QueryBuilder<Theater>()
        builder.addRegex('name', name)

        const query = builder.build(options)
        return query
    }
}
