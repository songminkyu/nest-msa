import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UsePipes } from '@nestjs/common'
import { TheaterCreateDto, TheaterQueryDto, TheatersClient, TheaterUpdateDto } from 'apps/cores'
import { DefaultPaginationPipe } from './pipes'

@Controller('theaters')
export class TheatersController {
    constructor(private theatersService: TheatersClient) {}

    @Post()
    async createTheater(@Body() createDto: TheaterCreateDto) {
        return this.theatersService.createTheater(createDto)
    }

    @Patch(':theaterId')
    async updateTheater(
        @Param('theaterId') theaterId: string,
        @Body() updateDto: TheaterUpdateDto
    ) {
        return this.theatersService.updateTheater(theaterId, updateDto)
    }

    @Get(':theaterId')
    async getTheater(@Param('theaterId') theaterId: string) {
        return this.theatersService.getTheaters([theaterId])
    }

    @Delete(':theaterId')
    async deleteTheater(@Param('theaterId') theaterId: string) {
        return this.theatersService.deleteTheaters([theaterId])
    }

    @UsePipes(DefaultPaginationPipe)
    @Get()
    async findTheaters(@Query() queryDto: TheaterQueryDto) {
        return this.theatersService.findTheaters(queryDto)
    }
}
