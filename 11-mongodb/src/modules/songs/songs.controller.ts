import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { DeleteResult } from 'mongoose';

import { CreateSongDTO } from './dto/create-song.dto';
import { UpdateSongDTO } from './dto/update-song.dto';
import { Song } from './schemas/song.schema';
import { SongsService } from './songs.service';

@Controller('songs')
export class SongsController {
  constructor(private songService: SongsService) {}

  @Post()
  create(
    @Body()
    createSongDTO: CreateSongDTO,
  ) {
    return this.songService.create(createSongDTO);
  }

  @Get()
  find(): Promise<Song[]> {
    return this.songService.find();
  }

  @Get(':id')
  findOne(
    @Param('id')
    id: string,
  ): Promise<Song> {
    return this.songService.findById(id);
  }

  // PUT - Complete update (replaces entire document)
  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') id: string,
    @Body() updateSongDto: UpdateSongDTO,
  ): Promise<Song> {
    return this.songService.update(id, updateSongDto);
  }

  // PATCH - Partial update (updates only provided fields)
  // @Patch(':id')
  // @HttpCode(HttpStatus.OK)
  // async partialUpdate(
  //   @Param('id') id: string,
  //   @Body() updateSongDto: UpdateSongDTO,
  // ): Promise<Song> {
  //   return this.songService.update(id, updateSongDto);
  // }

  @Delete(':id')
  delete(
    @Param('id')
    id: string,
  ): Promise<DeleteResult> {
    return this.songService.delete(id);
  }
}
