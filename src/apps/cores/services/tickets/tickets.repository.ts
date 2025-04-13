import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { MongooseRepository, objectId, objectIds, QueryBuilder, QueryBuilderOptions } from 'common'
import { Model } from 'mongoose'
import { SalesStatusByShowtimeDto, TicketCreateDto, TicketQueryDto } from './dtos'
import { Ticket, TicketStatus } from './models'

@Injectable()
export class TicketsRepository extends MongooseRepository<Ticket> {
    constructor(@InjectModel(Ticket.name) model: Model<Ticket>) {
        super(model)
    }

    async createTickets(createDtos: TicketCreateDto[]) {
        const tickets = createDtos.map((dto) => {
            const ticket = this.newDocument()
            ticket.batchId = objectId(dto.batchId)
            ticket.movieId = objectId(dto.movieId)
            ticket.theaterId = objectId(dto.theaterId)
            ticket.showtimeId = objectId(dto.showtimeId)
            ticket.status = dto.status
            ticket.seat = dto.seat

            return ticket
        })

        return this.saveMany(tickets)
    }

    async updateTicketStatus(ticketIds: string[], status: TicketStatus) {
        const result = await this.model.updateMany(
            { _id: { $in: objectIds(ticketIds) } },
            { $set: { status } }
        )

        return result
    }

    async findAllTickets(queryDto: TicketQueryDto) {
        const query = this.buildQuery(queryDto)

        const tickets = await this.model.find(query).sort({ batchId: 1 }).exec()
        return tickets
    }

    async getSalesStatuses(showtimeIds: string[]) {
        const salesStatuses = await this.model.aggregate([
            { $match: { showtimeId: { $in: objectIds(showtimeIds) } } },
            {
                $group: {
                    _id: '$showtimeId',
                    total: { $sum: 1 },
                    sold: { $sum: { $cond: [{ $eq: ['$status', TicketStatus.sold] }, 1, 0] } }
                }
            },
            {
                $project: {
                    _id: 0,
                    showtimeId: { $toString: '$_id' },
                    total: 1,
                    sold: 1,
                    available: { $subtract: ['$total', '$sold'] }
                }
            }
        ])

        return salesStatuses as SalesStatusByShowtimeDto[]
    }

    private buildQuery(queryDto: TicketQueryDto, options: QueryBuilderOptions = {}) {
        const { batchIds, movieIds, theaterIds, showtimeIds } = queryDto

        const builder = new QueryBuilder<Ticket>()
        builder.addIn('batchId', batchIds)
        builder.addIn('movieId', movieIds)
        builder.addIn('theaterId', theaterIds)
        builder.addIn('showtimeId', showtimeIds)

        const query = builder.build(options)
        return query
    }
}
