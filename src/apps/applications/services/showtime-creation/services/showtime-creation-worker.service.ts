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
import { CreateShowtimeBatchJobData, CreateShowtimeBatchStatus } from './types'

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

    async enqueueTask(data: CreateShowtimeBatchJobData) {
        this.events.emitStatusChanged({
            status: CreateShowtimeBatchStatus.WAITING,
            transactionId: data.transactionId
        })

        await this.queue.add('showtime-creation.create', data)
    }

    async process(job: Job<CreateShowtimeBatchJobData>) {
        try {
            await this.processJobData(jsonToObject(job.data))
        } catch (error) {
            this.events.emitStatusChanged({
                status: CreateShowtimeBatchStatus.ERROR,
                transactionId: job.data.transactionId,
                message: error.message
            })
        }
    }

    @MethodLog()
    private async processJobData(data: CreateShowtimeBatchJobData) {
        this.events.emitStatusChanged({
            status: CreateShowtimeBatchStatus.PROCESSING,
            transactionId: data.transactionId
        })

        const { isValid, conflictingShowtimes } = await this.validatorService.validate(
            data.createDto
        )

        if (isValid) {
            const createdShowtimes = await this.createShowtimeBatch(data)

            const createdTicketCount = await this.createTicketBatch(
                createdShowtimes,
                data.transactionId
            )

            this.events.emitStatusChanged({
                status: CreateShowtimeBatchStatus.SUCCEEDED,
                transactionId: data.transactionId,
                createdShowtimeCount: createdShowtimes.length,
                createdTicketCount
            })
        } else {
            this.events.emitStatusChanged({
                status: CreateShowtimeBatchStatus.FAILED,
                transactionId: data.transactionId,
                conflictingShowtimes
            })
        }
    }

    private async createShowtimeBatch({ transactionId, createDto }: CreateShowtimeBatchJobData) {
        const { movieId, theaterIds, durationMinutes, startTimes } = createDto

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

    private async createTicketBatch(showtimes: ShowtimeDto[], transactionId: string) {
        let totalCount = 0

        const theaterIds = Array.from(new Set(showtimes.map((showtime) => showtime.theaterId)))
        const theaters = await this.theatersService.getTheaters(theaterIds)

        const theatersById = new Map<string, TheaterDto>()
        theaters.forEach((theater) => theatersById.set(theater.id, theater))

        await Promise.all(
            showtimes.map(async (showtime) => {
                const theater = theatersById.get(showtime.theaterId)!

                Assert.defined(theater, 'The theater must exist.')

                const createTicketDtos = Seatmap.getAllSeats(theater.seatmap).map((seat) => ({
                    showtimeId: showtime.id,
                    theaterId: showtime.theaterId,
                    movieId: showtime.movieId,
                    status: TicketStatus.available,
                    seat,
                    transactionId
                }))

                const { count } = await this.ticketsService.createTickets(createTicketDtos)
                totalCount += count
            })
        )

        return totalCount
    }
}
