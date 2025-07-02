import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { MongooseRepository, objectId, objectIds, QueryBuilder, QueryBuilderOptions } from 'common'
import { Model } from 'mongoose'
import { TicketSalesForShowtimeDto, CreateTicketDto, SearchTicketsDto } from './dtos'
import { Ticket, TicketStatus } from './models'

@Injectable()
export class TicketsRepository extends MongooseRepository<Ticket> {
    constructor(@InjectModel(Ticket.name) model: Model<Ticket>) {
        super(model)
    }

    async createTickets(createDtos: CreateTicketDto[]) {
        const tickets = createDtos.map((dto) => {
            const ticket = this.newDocument()
            ticket.transactionId = objectId(dto.transactionId)
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

    async searchTickets(searchDto: SearchTicketsDto) {
        const query = this.buildQuery(searchDto)

        const tickets = await this.model.find(query).sort({ transactionId: 1 }).exec()
        return tickets
    }

    async getTicketSalesForShowtimes(showtimeIds: string[]) {
        const showtimeTicketSalesArray = await this.model.aggregate([
            { $match: { showtimeId: { $in: objectIds(showtimeIds) } } },
            {
                $group: {
                    _id: '$showtimeId',
                    total: { $sum: 1 },
                    sold: { $sum: { $cond: [{ $eq: ['$status', TicketStatus.Sold] }, 1, 0] } }
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

        return showtimeTicketSalesArray as TicketSalesForShowtimeDto[]
    }

    private buildQuery(searchDto: SearchTicketsDto, options: QueryBuilderOptions = {}) {
        const { transactionIds, movieIds, theaterIds, showtimeIds } = searchDto

        const builder = new QueryBuilder<Ticket>()
        builder.addIn('transactionId', transactionIds)
        builder.addIn('movieId', movieIds)
        builder.addIn('theaterId', theaterIds)
        builder.addIn('showtimeId', showtimeIds)

        const query = builder.build(options)
        return query
    }
}
