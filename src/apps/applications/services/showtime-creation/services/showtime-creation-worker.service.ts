import { InjectQueue, Processor, WorkerHost } from '@nestjs/bullmq'
import { Injectable } from '@nestjs/common'
import {
    Seatmap,
    ShowtimeDto,
    ShowtimesClient,
    TheaterDto,
    TheatersClient,
    TicketsClient,
    TicketStatus
} from 'apps/cores'
import { Job, Queue } from 'bullmq'
import { Assert, DateTimeRange, jsonToObject, MethodLog } from 'common'
import { ShowtimeCreationEvents } from '../showtime-creation.events'
import { ShowtimeCreationValidatorService } from './showtime-creation-validator.service'
import { ShowtimeBatchCreateJobData, ShowtimeBatchCreateStatus } from './types'

@Injectable()
@Processor('showtime-creation')
export class ShowtimeCreationWorkerService extends WorkerHost {
    constructor(
        private theatersService: TheatersClient,
        private showtimesService: ShowtimesClient,
        private ticketsService: TicketsClient,
        private validatorService: ShowtimeCreationValidatorService,
        private events: ShowtimeCreationEvents,
        @InjectQueue('showtime-creation') private queue: Queue
    ) {
        super()
    }

    async onModuleInit() {
        /*
        When Redis is offline during onModuleInit, the BullMQ initialization tasks wait in the offlineQueue.
        In this state, if onModuleDestroy is called before Redis comes online,
        the tasks in the offlineQueue throw an 'Error: Connection is closed' error.
        To address this, we use waitUntilReady so that the system waits until Redis is online.

        onModuleInit에서 Redis가 오프라인이면 BullMQ 초기화 작업이 offlineQueue에 대기한다.
        이 상태에서 Redis가 온라인 되기 전에 onModuleDestroy가 호출되면,
        offlineQueue의 작업들이 'Error: Connection is closed' 오류를 던진다.
        이를 해결하기 위해 waitUntilReady로 Redis가 온라인 될 때까지 대기한다.
        */
        await this.worker.waitUntilReady()
    }

    async enqueueTask(data: ShowtimeBatchCreateJobData) {
        this.events.emitStatusChanged({
            status: ShowtimeBatchCreateStatus.waiting,
            transactionId: data.transactionId
        })

        await this.queue.add('showtime-creation.create', data)
    }

    async process(job: Job<ShowtimeBatchCreateJobData>) {
        try {
            await this.processShowtimesCreation(jsonToObject(job.data))
        } catch (error) {
            this.events.emitStatusChanged({
                status: ShowtimeBatchCreateStatus.error,
                transactionId: job.data.transactionId,
                message: error.message
            })
        }
    }

    @MethodLog()
    private async processShowtimesCreation(data: ShowtimeBatchCreateJobData) {
        this.events.emitStatusChanged({
            status: ShowtimeBatchCreateStatus.processing,
            transactionId: data.transactionId
        })

        const conflictingShowtimes = await this.validatorService.validate(data)

        if (conflictingShowtimes.length > 0) {
            this.events.emitStatusChanged({
                status: ShowtimeBatchCreateStatus.fail,
                transactionId: data.transactionId,
                conflictingShowtimes
            })
        } else {
            const createdShowtimes = await this.createShowtimes(data)
            const createdTicketCount = await this.createTickets(
                createdShowtimes,
                data.transactionId
            )

            this.events.emitStatusChanged({
                status: ShowtimeBatchCreateStatus.complete,
                transactionId: data.transactionId,
                createdShowtimeCount: createdShowtimes.length,
                createdTicketCount
            })
        }
    }

    private async createShowtimes(data: ShowtimeBatchCreateJobData) {
        const { transactionId, movieId, theaterIds, durationMinutes, startTimes } = data

        const createDtos = theaterIds.flatMap((theaterId) =>
            startTimes.map((start) => ({
                transactionId,
                movieId,
                theaterId,
                timeRange: DateTimeRange.create({ start, minutes: durationMinutes })
            }))
        )

        await this.showtimesService.createShowtimes(createDtos)
        const showtimes = await this.showtimesService.searchShowtimes({
            transactionIds: [transactionId]
        })
        return showtimes
    }

    private async createTickets(showtimes: ShowtimeDto[], transactionId: string) {
        let totalCount = 0

        const theaterIds = Array.from(new Set(showtimes.map((showtime) => showtime.theaterId)))
        const theaters = await this.theatersService.getTheaters(theaterIds)

        const theatersById = new Map<string, TheaterDto>()
        theaters.forEach((theater) => theatersById.set(theater.id, theater))

        await Promise.all(
            showtimes.map(async (showtime) => {
                const theater = theatersById.get(showtime.theaterId)!

                Assert.defined(theater, 'The theater must exist.')

                const ticketCreateDtos = Seatmap.getAllSeats(theater.seatmap).map((seat) => ({
                    showtimeId: showtime.id,
                    theaterId: showtime.theaterId,
                    movieId: showtime.movieId,
                    status: TicketStatus.available,
                    seat,
                    transactionId
                }))

                const { count } = await this.ticketsService.createTickets(ticketCreateDtos)
                totalCount += count
            })
        )

        return totalCount
    }
}
