import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    MessageEvent,
    OnModuleDestroy,
    Post,
    Query,
    Sse,
    UsePipes
} from '@nestjs/common'
import { EventPattern } from '@nestjs/microservices'
import { CreateShowtimeBatchDto, ShowtimeCreationClient } from 'apps/applications'
import { CommonQueryDto } from 'common'
import { Observable, Subject } from 'rxjs'
import { Events } from 'shared'
import { DefaultPaginationPipe } from './pipes'

@Controller('showtime-creation')
export class ShowtimeCreationController implements OnModuleDestroy {
    private sseEventSubject = new Subject<MessageEvent>()

    constructor(private showtimeCreationService: ShowtimeCreationClient) {}

    onModuleDestroy() {
        this.sseEventSubject.complete()
    }

    @UsePipes(DefaultPaginationPipe)
    @Get('theaters')
    async searchTheatersPage(@Query() queryDto: CommonQueryDto) {
        return this.showtimeCreationService.searchTheatersPage(queryDto)
    }

    @UsePipes(DefaultPaginationPipe)
    @Get('movies')
    async searchMoviesPage(@Query() queryDto: CommonQueryDto) {
        return this.showtimeCreationService.searchMoviesPage(queryDto)
    }

    @HttpCode(HttpStatus.OK)
    @Post('showtimes/find')
    async searchShowtimesByTheaterIds(@Body('theaterIds') theaterIds: string[]) {
        return this.showtimeCreationService.searchShowtimes(theaterIds)
    }

    @HttpCode(HttpStatus.ACCEPTED)
    @Post('showtimes')
    async createBatchShowtimes(@Body() createDto: CreateShowtimeBatchDto) {
        return this.showtimeCreationService.createBatchShowtimes(createDto)
    }

    @Sse('events')
    events(): Observable<MessageEvent> {
        return this.sseEventSubject.asObservable()
    }

    @EventPattern(Events.ShowtimeCreation.statusChanged, {
        queue: false // 모든 인스턴스에 이벤트 브로드캐스팅 설정
    })
    handleEvent(data: any) {
        this.sseEventSubject.next({ data })
    }
}
