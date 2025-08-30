import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateSongDTO } from './dto/create-song.dto';
import { Song } from './song.entity';

@Injectable()
export class SongsService {
  constructor(
    @InjectRepository(Song)
    private songRepository: Repository<Song>,
  ) {}

  // async create(songDTO: CreateSongDTO): Promise<Song> {
  //   const song = new Song();
  //   song.title = songDTO.title;
  //   song.artists = songDTO.artists;
  //   song.duration = songDTO.duration;
  //   song.lyrics = songDTO.lyrics;
  //   song.releasedDate = songDTO.releasedDate;
  //   return await this.songRepository.save(song);
  // }

  async create(songDTO: CreateSongDTO): Promise<Song> {
    const song = this.songRepository.create(songDTO);
    return await this.songRepository.save(song);
  }

  findAll() {
    // Error comes while fetching the data from DB
    throw new Error('Error in Database while fetching songs');

    // fetch the songs from the database
    // return this.songs;
  }
}
