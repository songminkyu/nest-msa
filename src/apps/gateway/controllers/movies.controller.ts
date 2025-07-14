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
    UseInterceptors
} from '@nestjs/common'
import { FilesInterceptor } from '@nestjs/platform-express'
import { RecommendationClient } from 'apps/applications'
import { CreateMovieDto, MoviesClient, SearchMoviesPageDto, UpdateMovieDto } from 'apps/cores'
import { MulterExceptionFilter } from './filters'
import { CustomerOptionalJwtAuthGuard } from './guards'
import { CustomerAuthRequest } from './types'

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
        @Body() createMovieDto: CreateMovieDto
    ) {
        const createFileDtos = files.map((file) => ({
            originalName: file.originalname,
            mimeType: file.mimetype,
            size: file.size,
            path: file.path
        }))

        return this.moviesService.createMovie(createMovieDto, createFileDtos)
    }

    @Patch(':movieId')
    async updateMovie(@Param('movieId') movieId: string, @Body() updateDto: UpdateMovieDto) {
        return this.moviesService.updateMovie(movieId, updateDto)
    }

    @UseGuards(CustomerOptionalJwtAuthGuard)
    @Get('recommended')
    async searchRecommendedMovies(@Req() req: CustomerAuthRequest) {
        const customerId = req.user.customerId
        return this.recommendationService.searchRecommendedMovies(customerId)
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

    @Get()
    async searchMoviesPage(@Query() searchDto: SearchMoviesPageDto) {
        return this.moviesService.searchMoviesPage(searchDto)
    }
}
