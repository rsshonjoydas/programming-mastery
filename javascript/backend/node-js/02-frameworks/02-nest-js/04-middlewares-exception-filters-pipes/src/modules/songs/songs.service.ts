import { Injectable } from '@nestjs/common';

@Injectable()
export class SongsService {
  // local database -> array
  private readonly songs: unknown[] = [];

  create(song) {
    // save the song in the database
    this.songs.push(song);
    return this.songs;
  }

  findAll() {
    // Error comes while fetching the data from DB
    throw new Error('Error in Database while fetching songs');

    // fetch the songs from the database
    // return this.songs;
  }
}
