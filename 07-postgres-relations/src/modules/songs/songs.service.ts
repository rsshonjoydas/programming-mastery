import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { DeleteResult, In, Repository } from 'typeorm';

import { Artist } from '@/modules/artists/artist.entity';
import { CreateSongDTO } from './dto/create-song.dto';
import { UpdateSongDTO } from './dto/update-song.dto';
import { Song } from './song.entity';

@Injectable()
export class SongsService {
  constructor(
    @InjectRepository(Song)
    private songRepository: Repository<Song>,
    @InjectRepository(Artist)
    private artistsRepository: Repository<Artist>,
  ) {}

  // async create(songDTO: CreateSongDTO): Promise<Song> {
  //   // Create song entity using repository.create() for cleaner instantiation
  //   const song = this.songRepository.create({
  //     title: songDTO.title,
  //     duration: songDTO.duration,
  //     lyrics: songDTO.lyrics,
  //     releasedDate: songDTO.releasedDate,
  //   });

  //   // Handle artist relationships if artists are provided
  //   if (songDTO.artists && songDTO.artists.length > 0) {
  //     const artists = await this.artistsRepository.findBy({
  //       id: In(songDTO.artists),
  //     });
  //     song.artists = artists;
  //   }

  //   return await this.songRepository.save(song);
  // }

  async create(songDTO: CreateSongDTO): Promise<Song> {
    // Create song entity - exclude artists from initial creation since it needs special handling
    const { artists: artistIds, ...songData } = songDTO;
    const song = this.songRepository.create(songData);

    // Handle artist relationships if artists are provided
    if (artistIds && artistIds.length > 0) {
      const artists = await this.artistsRepository.findBy({
        id: In(artistIds),
      });
      song.artists = artists;
    }

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

  // update(id: number, recordToUpdate: UpdateSongDTO): Promise<UpdateResult> {
  //   return this.songRepository.update(id, recordToUpdate);
  // }

  async update(id: number, updateSongDTO: UpdateSongDTO): Promise<Song> {
    // Separate artists from other update data
    const { artists: artistIds, ...songUpdateData } = updateSongDTO;

    // Update basic song properties
    await this.songRepository.update(id, songUpdateData);

    // Handle artist relationships if provided
    if (artistIds !== undefined) {
      const song = await this.songRepository.findOne({
        where: { id },
        relations: ['artists'],
      });

      if (!song) {
        throw new Error('Song not found');
      }

      if (artistIds.length > 0) {
        const artists = await this.artistsRepository.findBy({
          id: In(artistIds),
        });
        song.artists = artists;
      } else {
        // Clear artists if empty array is provided
        song.artists = [];
      }

      return await this.songRepository.save(song);
    }

    // If no artist update needed, just return the updated song
    const updatedSong = await this.songRepository.findOne({ where: { id } });
    if (!updatedSong) {
      throw new Error('Song not found');
    }
    return updatedSong;
  }

  async paginate(
    options: IPaginationOptions & { route?: string },
  ): Promise<Pagination<Song>> {
    const page =
      typeof options.page === 'string'
        ? parseInt(options.page, 10)
        : options.page;
    const limit =
      typeof options.limit === 'string'
        ? parseInt(options.limit, 10)
        : options.limit;

    const paginationOptions: IPaginationOptions = {
      page: page || 1,
      limit: Math.min(limit || 10, 100),
      route: options.route,
    };

    const queryBuilder = this.songRepository.createQueryBuilder('song');
    queryBuilder.orderBy('song.releasedDate', 'DESC');

    return paginate<Song>(queryBuilder, paginationOptions);
  }
}
