import { CreateShowtimeBatchDto } from '../dtos'

export class ShowtimeCreationJobData {
    createDto: CreateShowtimeBatchDto
    transactionId: string
}

export enum ShowtimeCreationStatus {
    Waiting = 'waiting',
    Processing = 'processing',
    Succeeded = 'succeeded',
    Failed = 'failed',
    Error = 'error'
}
