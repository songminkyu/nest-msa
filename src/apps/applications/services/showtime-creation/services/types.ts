import { CreateShowtimeBatchDto } from '../dtos'

export class CreateShowtimeBatchJobData {
    createDto: CreateShowtimeBatchDto
    transactionId: string
}

export enum CreateShowtimeBatchStatus {
    Waiting = 'waiting',
    Processing = 'processing',
    Succeeded = 'succeeded',
    Failed = 'failed',
    Error = 'error'
}
