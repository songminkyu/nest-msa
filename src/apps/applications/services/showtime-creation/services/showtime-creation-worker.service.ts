import { InjectQueue, Processor, WorkerHost } from '@nestjs/bullmq'
import { Injectable } from '@nestjs/common'
import { Job, Queue } from 'bullmq'
import { jsonToObject, MethodLog } from 'common'
import { ShowtimeCreationEvents } from '../showtime-creation.events'
import { ShowtimeBatchCreatorService } from './showtime-batch-creator.service'
import { ShowtimeBatchValidatorService } from './showtime-batch-validator.service'
import { CreateShowtimeBatchJobData, CreateShowtimeBatchStatus } from './types'

@Injectable()
@Processor('showtime-creation')
export class ShowtimeCreationWorkerService extends WorkerHost {
    constructor(
        private validatorService: ShowtimeBatchValidatorService,
        private creatorService: ShowtimeBatchCreatorService,
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
            status: CreateShowtimeBatchStatus.Waiting,
            transactionId: data.transactionId
        })

        await this.queue.add('showtime-creation.create', data)
    }

    async process(job: Job<CreateShowtimeBatchJobData>) {
        try {
            await this.processJobData(jsonToObject(job.data))
        } catch (error) {
            this.events.emitStatusChanged({
                status: CreateShowtimeBatchStatus.Error,
                transactionId: job.data.transactionId,
                message: error.message
            })
        }
    }

    @MethodLog()
    private async processJobData({ transactionId, createDto }: CreateShowtimeBatchJobData) {
        this.events.emitStatusChanged({
            status: CreateShowtimeBatchStatus.Processing,
            transactionId
        })

        const { isValid, conflictingShowtimes } = await this.validatorService.validate(createDto)

        if (isValid) {
            const result = await this.creatorService.create(createDto, transactionId)

            this.events.emitStatusChanged({
                status: CreateShowtimeBatchStatus.Succeeded,
                transactionId,
                ...result
            })
        } else {
            this.events.emitStatusChanged({
                status: CreateShowtimeBatchStatus.Failed,
                transactionId,
                conflictingShowtimes
            })
        }
    }
}
