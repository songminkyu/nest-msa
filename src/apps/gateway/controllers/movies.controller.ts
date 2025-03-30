import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Query,
    Req,
    UploadedFiles,
    UseFilters,
    UseGuards,
    UseInterceptors,
    UsePipes
} from '@nestjs/common'
import { FilesInterceptor } from '@nestjs/platform-express'
import { RecommendationClient } from 'apps/applications'
import { MovieCreateDto, MovieQueryDto, MoviesClient, MovieUpdateDto } from 'apps/cores'
import { pick } from 'lodash'
import { MulterExceptionFilter } from './filters'
import { CustomerOptionalJwtAuthGuard } from './guards'
import { DefaultPaginationPipe } from './pipes'
import { AuthRequest } from './types'

@Controller('movies')
export class MoviesController {
    constructor(
        private moviesService: MoviesClient,
        private recommendationService: RecommendationClient
    ) {}

    @UseFilters(new MulterExceptionFilter())
    @UseInterceptors(FilesInterceptor('files'))
    @Post()
    async createMovie(
        @UploadedFiles() files: Express.Multer.File[],
        @Body() movieCreateDto: MovieCreateDto
    ) {
        const fileCreateDtos = files.map((file) =>
            pick(file, 'originalname', 'mimetype', 'size', 'path')
        )

        return this.moviesService.createMovie(movieCreateDto, fileCreateDtos)
    }

    @Patch(':movieId')
    async updateMovie(@Param('movieId') movieId: string, @Body() updateDto: MovieUpdateDto) {
        return this.moviesService.updateMovie(movieId, updateDto)
    }

    @UseGuards(CustomerOptionalJwtAuthGuard)
    @Get('recommended')
    async findRecommendedMovies(@Req() req: AuthRequest) {
        const customerId = req.user.userId
        return this.recommendationService.findRecommendedMovies(customerId)
    }

    @Get(':movieId')
    async getMovie(@Param('movieId') movieId: string) {
        const movies = await this.moviesService.getMovies([movieId])
        return movies[0]
    }

    @Delete(':movieId')
    async deleteMovie(@Param('movieId') movieId: string) {
        return this.moviesService.deleteMovies([movieId])
    }

    @UsePipes(DefaultPaginationPipe)
    @Get()
    async findMovies(@Query() queryDto: MovieQueryDto) {
        return this.moviesService.findMovies(queryDto)
    }
}
