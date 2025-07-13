import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common'
import {
    CreateTheaterDto,
    SearchTheatersPageDto,
    TheatersClient,
    UpdateTheaterDto
} from 'apps/cores'

@Controller('theaters')
export class TheatersController {
    constructor(private theatersService: TheatersClient) {}

    @Post()
    async createTheater(@Body() createDto: CreateTheaterDto) {
        return this.theatersService.createTheater(createDto)
    }

    @Patch(':theaterId')
    async updateTheater(
        @Param('theaterId') theaterId: string,
        @Body() updateDto: UpdateTheaterDto
    ) {
        return this.theatersService.updateTheater(theaterId, updateDto)
    }

    @Get(':theaterId')
    async getTheater(@Param('theaterId') theaterId: string) {
        const theaters = await this.theatersService.getTheaters([theaterId])
        return theaters[0]
    }

    @Delete(':theaterId')
    async deleteTheater(@Param('theaterId') theaterId: string) {
        return this.theatersService.deleteTheaters([theaterId])
    }

    @Get()
    async searchTheatersPage(@Query() searchDto: SearchTheatersPageDto) {
        return this.theatersService.searchTheatersPage(searchDto)
    }
}
