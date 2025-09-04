import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Song } from '@/modules/songs/song.entity';
import { User } from '@/modules/users/user.entity';

@Entity('playlists')
export class Playlist {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  /**
   * Each Playlist will have multiple songs
   */
  @OneToMany(() => Song, (song) => song.playList)
  songs: Song[];

  /**
   * Many Playlist can belong to a single unique user
   */
  @ManyToOne(() => User, (user) => user.playLists)
  user: User;
}
