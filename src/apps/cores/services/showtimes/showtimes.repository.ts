import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { MongooseRepository, objectId, QueryBuilder, QueryBuilderOptions } from 'common'
import { Model } from 'mongoose'
import { CreateShowtimeDto, SearchShowtimesDto } from './dtos'
import { Showtime } from './models'

@Injectable()
export class ShowtimesRepository extends MongooseRepository<Showtime> {
    constructor(@InjectModel(Showtime.name) model: Model<Showtime>) {
        super(model)
    }

    async createShowtimes(createDtos: CreateShowtimeDto[]) {
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

    async searchShowtimes(searchDto: SearchShowtimesDto) {
        const query = this.buildQuery(searchDto)

        const showtimes = await this.model.find(query).sort({ timeRange: 1 }).exec()
        return showtimes
    }

    async findMovieIds(searchDto: SearchShowtimesDto) {
        const query = this.buildQuery(searchDto)

        const movieIds = await this.model.distinct('movieId', query).exec()
        return movieIds.map((id) => id.toString())
    }

    async searchTheaterIds(searchDto: SearchShowtimesDto) {
        const query = this.buildQuery(searchDto)

        const theaterIds = await this.model.distinct('theaterId', query).exec()
        return theaterIds.map((id) => id.toString())
    }

    async searchShowdates(searchDto: SearchShowtimesDto) {
        const query = this.buildQuery(searchDto)

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

    private buildQuery(searchDto: SearchShowtimesDto, options: QueryBuilderOptions = {}) {
        const { batchIds, movieIds, theaterIds, startTimeRange, endTimeRange } = searchDto

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
