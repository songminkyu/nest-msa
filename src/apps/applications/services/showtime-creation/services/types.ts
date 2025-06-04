import { CreateShowtimeBatchDto } from '../dtos'

export class ShowtimeBatchCreateJobData extends CreateShowtimeBatchDto {
    batchId: string
}

export enum ShowtimeBatchCreateStatus {
    waiting = 'waiting',
    processing = 'processing',
    complete = 'complete',
    fail = 'fail',
    error = 'error'
}
