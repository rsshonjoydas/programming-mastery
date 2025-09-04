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
} from '@nestjs/common';
import { type Request } from 'express';
import { Pagination } from 'nestjs-typeorm-paginate';
import { DeleteResult, UpdateResult } from 'typeorm';

import { CreateSongDTO } from './dto/create-song.dto';
import { UpdateSongDTO } from './dto/update-song.dto';
import { Song } from './song.entity';
import { SongsService } from './songs.service';

@Controller('songs')
export class SongsController {
  constructor(private songsService: SongsService) {}

  @Post()
  create(@Body() createSongDTO: CreateSongDTO): Promise<Song> {
    return this.songsService.create(createSongDTO);
  }

  // @Get()
  // findAll(): Promise<Song[]> {
  //   try {
  //     return this.songsService.findAll();
  //   } catch (error) {
  //     throw new HttpException(
  //       'Internal server error',
  //       HttpStatus.INTERNAL_SERVER_ERROR,
  //       { cause: error },
  //     );
  //   }
  // }

  // @Get()
  // findAll(
  //   @Query('page', new DefaultValuePipe(1), ParseIntPipe)
  //   page = 1,
  //   @Query('limit', new DefaultValuePipe(10), ParseIntPipe)
  //   limit = 10,
  // ): Promise<Pagination<Song>> {
  //   limit = limit > 100 ? 100 : limit;
  //   return this.songsService.paginate({
  //     page,
  //     limit,
  //   });
  // }

  @Get()
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe)
    page = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe)
    limit = 10,
    @Req() request: Request,
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
  ): Promise<UpdateResult> {
    return this.songsService.update(id, updateSongDTO);
  }
}
