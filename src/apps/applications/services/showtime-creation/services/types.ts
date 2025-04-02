import { ShowtimeBatchCreateDto } from '../dtos'

export class ShowtimeBatchCreateJobData extends ShowtimeBatchCreateDto {
    batchId: string
}

export enum ShowtimeBatchCreateStatus {
    waiting = 'waiting',
    processing = 'processing',
    complete = 'complete',
    fail = 'fail',
    error = 'error'
}
