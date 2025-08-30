import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';

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

  findAll(): Promise<Song[]> {
    return this.songRepository.find();
  }

  async findOne(id: number): Promise<Song> {
    const song = await this.songRepository.findOneBy({ id });
    if (!song) {
      throw new NotFoundException(`Song with ID ${id} not found`);
    }
    return song;
  }

  async remove(id: number): Promise<DeleteResult> {
    return await this.songRepository.delete(id);
  }
}
