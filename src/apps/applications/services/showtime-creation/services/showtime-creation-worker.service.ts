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
import { Assert, DateUtil, jsonToObject, MethodLog } from 'common'
import { ShowtimeCreationClient } from '../showtime-creation.client'
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
        private client: ShowtimeCreationClient,
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
        this.client.emitStatusChanged({
            status: ShowtimeBatchCreateStatus.waiting,
            batchId: data.batchId
        })

        await this.queue.add('showtime-creation.create', data)
    }

    async process(job: Job<ShowtimeBatchCreateJobData>) {
        try {
            await this.executeShowtimesCreation(jsonToObject(job.data))
        } catch (error) {
            this.client.emitStatusChanged({
                status: ShowtimeBatchCreateStatus.error,
                batchId: job.data.batchId,
                message: error.message
            })
        }
    }

    @MethodLog()
    private async executeShowtimesCreation(data: ShowtimeBatchCreateJobData) {
        this.client.emitStatusChanged({
            status: ShowtimeBatchCreateStatus.processing,
            batchId: data.batchId
        })

        const conflictingShowtimes = await this.validatorService.validate(data)

        if (conflictingShowtimes.length > 0) {
            this.client.emitStatusChanged({
                status: ShowtimeBatchCreateStatus.fail,
                batchId: data.batchId,
                conflictingShowtimes
            })
        } else {
            const createdShowtimes = await this.createShowtimes(data)
            const ticketCreatedCount = await this.createTickets(createdShowtimes, data.batchId)

            this.client.emitStatusChanged({
                status: ShowtimeBatchCreateStatus.complete,
                batchId: data.batchId,
                showtimeCreatedCount: createdShowtimes.length,
                ticketCreatedCount
            })
        }
    }

    private async createShowtimes(data: ShowtimeBatchCreateJobData) {
        const { batchId, movieId, theaterIds, durationMinutes, startTimes } = data

        const createDtos = theaterIds.flatMap((theaterId) =>
            startTimes.map((startTime) => ({
                batchId,
                movieId,
                theaterId,
                startTime,
                endTime: DateUtil.addMinutes(startTime, durationMinutes)
            }))
        )

        await this.showtimesService.createShowtimes(createDtos)
        const showtimes = await this.showtimesService.findAllShowtimes({ batchIds: [batchId] })
        return showtimes
    }

    private async createTickets(showtimes: ShowtimeDto[], batchId: string) {
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
                    batchId
                }))

                const { count } = await this.ticketsService.createTickets(ticketCreateDtos)
                totalCount += count
            })
        )

        return totalCount
    }
}
