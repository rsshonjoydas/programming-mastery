import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Playlist } from '@/modules/playlists/playlist.entity';
import { PlayListsController } from '@/modules/playlists/playlists.controller';
import { PlayListsService } from '@/modules/playlists/playlists.service';
import { Song } from '@/modules/songs/song.entity';
import { User } from '@/modules/users/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Playlist, Song, User])],
  controllers: [PlayListsController],
  providers: [PlayListsService],
})
export class PlayListModule {}
