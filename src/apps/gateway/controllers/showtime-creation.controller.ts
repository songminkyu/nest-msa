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
import { BulkCreateShowtimesDto, ShowtimeCreationClient } from 'apps/applications'
import { CommonQueryDto } from 'common'
import { Observable, Subject } from 'rxjs'
import { Events } from 'shared'
import { DefaultCommonQueryPipe } from './pipes'

@Controller('showtime-creation')
export class ShowtimeCreationController implements OnModuleDestroy {
    private eventStream = new Subject<MessageEvent>()

    constructor(private showtimeCreationService: ShowtimeCreationClient) {}

    onModuleDestroy() {
        this.eventStream.complete()
    }

    @UsePipes(DefaultCommonQueryPipe)
    @Get('theaters')
    async searchTheatersPage(@Query() searchDto: CommonQueryDto) {
        return this.showtimeCreationService.searchTheatersPage(searchDto)
    }

    @UsePipes(DefaultCommonQueryPipe)
    @Get('movies')
    async searchMoviesPage(@Query() searchDto: CommonQueryDto) {
        return this.showtimeCreationService.searchMoviesPage(searchDto)
    }

    @HttpCode(HttpStatus.OK)
    @Post('showtimes/search')
    async searchShowtimesByTheaterIds(@Body('theaterIds') theaterIds: string[]) {
        return this.showtimeCreationService.searchShowtimes(theaterIds)
    }

    @HttpCode(HttpStatus.ACCEPTED)
    @Post('showtimes')
    async requestShowtimeCreation(@Body() createDto: BulkCreateShowtimesDto) {
        return this.showtimeCreationService.requestShowtimeCreation(createDto)
    }

    @Sse('event-stream')
    getEventStream(): Observable<MessageEvent> {
        return this.eventStream.asObservable()
    }

    @EventPattern(Events.ShowtimeCreation.statusChanged, {
        queue: false // 모든 인스턴스에 이벤트 브로드캐스팅 설정
    })
    handleEvent(data: any) {
        this.eventStream.next({ data })
    }
}
