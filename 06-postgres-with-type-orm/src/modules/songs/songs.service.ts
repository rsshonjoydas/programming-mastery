import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';

import { CreateSongDTO } from './dto/create-song.dto';
import { UpdateSongDTO } from './dto/update-song.dto';
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

  update(id: number, recordToUpdate: UpdateSongDTO): Promise<UpdateResult> {
    return this.songRepository.update(id, recordToUpdate);
  }

  async paginate(options: IPaginationOptions): Promise<Pagination<Song>> {
    // Adding query builder
    // If you need to add query builder you can add it here
    return paginate<Song>(this.songRepository, options);
  }
}
