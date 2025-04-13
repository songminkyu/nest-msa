import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { MongooseRepository, objectId, QueryBuilder, QueryBuilderOptions } from 'common'
import { Model } from 'mongoose'
import { ShowtimeCreateDto, ShowtimeQueryDto } from './dtos'
import { Showtime } from './models'

@Injectable()
export class ShowtimesRepository extends MongooseRepository<Showtime> {
    constructor(@InjectModel(Showtime.name) model: Model<Showtime>) {
        super(model)
    }

    async createShowtimes(createDtos: ShowtimeCreateDto[]) {
        const showtimes = createDtos.map((dto) => {
            const doc = this.newDocument()
            doc.batchId = objectId(dto.batchId)
            doc.movieId = objectId(dto.movieId)
            doc.theaterId = objectId(dto.theaterId)
            doc.timeRange = dto.timeRange

            return doc
        })

        await this.saveMany(showtimes)
    }

    async findAllShowtimes(queryDto: ShowtimeQueryDto) {
        const query = this.buildQuery(queryDto)

        const showtimes = await this.model.find(query).sort({ timeRange: 1 }).exec()
        return showtimes
    }

    async findMovieIds(queryDto: ShowtimeQueryDto) {
        const query = this.buildQuery(queryDto)

        const movieIds = await this.model.distinct('movieId', query).exec()
        return movieIds.map((id) => id.toString())
    }

    async findTheaterIds(queryDto: ShowtimeQueryDto) {
        const query = this.buildQuery(queryDto)

        const theaterIds = await this.model.distinct('theaterId', query).exec()
        return theaterIds.map((id) => id.toString())
    }

    async findShowdates(queryDto: ShowtimeQueryDto) {
        const query = this.buildQuery(queryDto)

        const showdates = await this.model.aggregate([
            { $match: query },
            {
                $project: {
                    date: { $dateToString: { format: '%Y-%m-%d', date: '$timeRange.start' } }
                }
            },
            { $group: { _id: '$date' } },
            { $sort: { _id: 1 } }
        ])

        return showdates.map((item) => new Date(item._id))
    }

    private buildQuery(queryDto: ShowtimeQueryDto, options: QueryBuilderOptions = {}) {
        const { batchIds, movieIds, theaterIds, startTimeRange, endTimeRange } = queryDto

        const builder = new QueryBuilder<Showtime>()
        builder.addIn('batchId', batchIds)
        builder.addIn('movieId', movieIds)
        builder.addIn('theaterId', theaterIds)
        builder.addRange('timeRange.start', startTimeRange)
        builder.addRange('timeRange.end', endTimeRange)

        const query = builder.build(options)
        return query
    }
}
