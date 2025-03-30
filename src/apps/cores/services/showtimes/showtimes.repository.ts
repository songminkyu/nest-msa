import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { MongooseRepository, objectId, QueryBuilder } from 'common'
import { Model } from 'mongoose'
import { ShowtimeCreateDto, ShowtimeFilterDto } from './dtos'
import { Showtime } from './models'

@Injectable()
export class ShowtimesRepository extends MongooseRepository<Showtime> {
    constructor(@InjectModel(Showtime.name) model: Model<Showtime>) {
        super(model)
    }

    async createShowtimes(createDtos: ShowtimeCreateDto[]) {
        const showtimes = createDtos.map((dto) => {
            const doc = this.newDocument()
            doc.movieId = objectId(dto.movieId)
            doc.theaterId = objectId(dto.theaterId)
            doc.startTime = dto.startTime
            doc.endTime = dto.endTime
            doc.batchId = objectId(dto.batchId)

            return doc
        })

        await this.saveMany(showtimes)
    }

    async findAllShowtimes(filterDto: ShowtimeFilterDto) {
        const query = this.buildFindQuery(filterDto)

        const showtimes = await this.model.find(query).sort({ startTime: 1 }).exec()
        return showtimes
    }

    async findMovieIdsShowingAfter(time: Date) {
        const movieIds = await this.model.distinct('movieId', { startTime: { $gt: time } }).exec()
        return movieIds.map((id) => id.toString())
    }

    async findTheaterIds(filterDto: ShowtimeFilterDto) {
        const query = this.buildFindQuery(filterDto)

        const theaterIds = await this.model.distinct('theaterId', query).exec()
        return theaterIds.map((id) => id.toString())
    }

    async findShowdates(filterDto: ShowtimeFilterDto) {
        const query = this.buildFindQuery(filterDto)

        const showdates = await this.model.aggregate([
            { $match: query },
            { $project: { date: { $dateToString: { format: '%Y-%m-%d', date: '$startTime' } } } },
            { $group: { _id: '$date' } },
            { $sort: { _id: 1 } }
        ])

        return showdates.map((item) => new Date(item._id))
    }

    private buildFindQuery(filterDto: ShowtimeFilterDto) {
        const { batchIds, movieIds, theaterIds, startTimeRange, endTimeRange } = filterDto

        const builder = new QueryBuilder<Showtime>()
        builder.addIn('batchId', batchIds)
        builder.addIn('movieId', movieIds)
        builder.addIn('theaterId', theaterIds)
        builder.addRange('startTime', startTimeRange)
        builder.addRange('endTime', endTimeRange)

        const query = builder.build({})

        return query
    }
}
