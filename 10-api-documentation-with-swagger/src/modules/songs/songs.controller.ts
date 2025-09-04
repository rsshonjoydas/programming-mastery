import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Req,
  Request,
  UseGuards,
} from '@nestjs/common';
import { type Request as ExpressRequest } from 'express';
import { Pagination } from 'nestjs-typeorm-paginate';
import { DeleteResult } from 'typeorm';

import { JwtArtistGuard } from '../auth/jwt-artist.guard';
import { CreateSongDTO } from './dto/create-song.dto';
import { UpdateSongDTO } from './dto/update-song.dto';
import { Song } from './song.entity';
import { SongsService } from './songs.service';

@Controller('songs')
export class SongsController {
  constructor(private songsService: SongsService) {}

  @Post()
  @UseGuards(JwtArtistGuard)
  create(@Body() createSongDTO: CreateSongDTO, @Request() req): Promise<Song> {
    console.log(req.user);
    return this.songsService.create(createSongDTO);
  }

  @Get()
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe)
    page = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe)
    limit = 10,
    @Req() request: ExpressRequest,
  ): Promise<Pagination<Song>> {
    limit = limit > 100 ? 100 : limit;

    // Get base URL
    const baseUrl = `${request.protocol}://${request.get('host')}${request.path}`;

    return this.songsService.paginate({
      page,
      limit,
      route: baseUrl,
    });
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Song> {
    return this.songsService.findOne(id);
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number): Promise<DeleteResult> {
    return this.songsService.remove(id);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSongDTO: UpdateSongDTO,
  ): Promise<Song> {
    return this.songsService.update(id, updateSongDTO);
  }
}
