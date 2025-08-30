import { type Connection } from '@/common/constants/connection';
import { Inject, Injectable, Scope } from '@nestjs/common';

// @Injectable()
@Injectable({
  scope: Scope.TRANSIENT,
})
export class SongsService {
  // local database -> array
  private readonly songs: unknown[] = [];

  constructor(
    @Inject('CONNECTION')
    connection: Connection,
  ) {
    console.log('connection string', connection.CONNECTION_STRING);
  }

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
