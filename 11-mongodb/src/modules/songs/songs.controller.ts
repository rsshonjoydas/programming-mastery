import { Body, Controller, Get, Post } from '@nestjs/common';

import { CreateSongDTO } from './dto/create-song.dto';
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
}
