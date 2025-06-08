import { CreateShowtimeBatchDto } from '../dtos'

export class CreateShowtimeBatchJobData {
    createDto: CreateShowtimeBatchDto
    transactionId: string
}

export enum CreateShowtimeBatchStatus {
    WAITING = 'waiting',
    PROCESSING = 'processing',
    SUCCEEDED = 'succeeded',
    FAILED = 'failed',
    ERROR = 'error'
}
