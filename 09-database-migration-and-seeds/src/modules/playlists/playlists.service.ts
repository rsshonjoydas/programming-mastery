import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

import { CreatePlayListDTO } from '@/modules/playlists/dto/create-playlist.dto';
import { Playlist } from '@/modules/playlists/playlist.entity';
import { Song } from '@/modules/songs/song.entity';
import { User } from '@/modules/users/user.entity';

@Injectable()
export class PlayListsService {
  constructor(
    @InjectRepository(Playlist)
    private playListRepo: Repository<Playlist>,

    @InjectRepository(Song)
    private songsRepo: Repository<Song>,

    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}
  async create(playListDTO: CreatePlayListDTO): Promise<Playlist> {
    // Validate input DTO
    if (!playListDTO) {
      throw new Error('PlayList data is required');
    }

    if (!playListDTO.name?.trim()) {
      throw new Error('Playlist name is required');
    }

    if (!playListDTO.user) {
      throw new Error('User ID is required');
    }

    // Create new playlist instance
    const playList = new Playlist();
    playList.name = playListDTO.name.trim();

    // Handle songs if provided
    if (playListDTO.songs && playListDTO.songs.length > 0) {
      const songs = await this.songsRepo.findBy({ id: In(playListDTO.songs) });

      // Check if all requested songs were found
      if (songs.length !== playListDTO.songs.length) {
        throw new Error('Some songs were not found');
      }

      playList.songs = songs;
    } else {
      // Initialize with empty array if no songs provided
      playList.songs = [];
    }

    // Find and validate user
    const user = await this.userRepo.findOneBy({ id: playListDTO.user });
    if (!user) {
      throw new Error('User not found');
    }

    playList.user = user;

    try {
      return await this.playListRepo.save(playList);
    } catch (error) {
      throw new Error(`Failed to create playlist: ${error.message}`);
    }
  }
}
