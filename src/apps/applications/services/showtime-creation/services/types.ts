import { BulkCreateShowtimesDto } from '../dtos'

export class ShowtimeCreationJobData {
    createDto: BulkCreateShowtimesDto
    transactionId: string
}

export enum ShowtimeCreationStatus {
    Waiting = 'waiting',
    Processing = 'processing',
    Succeeded = 'succeeded',
    Failed = 'failed',
    Error = 'error'
}
