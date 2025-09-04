import { Exclude } from 'class-transformer';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { Playlist } from '@/modules/playlists/playlist.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: 'John',
    description: 'Provide the first name of the user',
  })
  @Column()
  firstName: string;

  @ApiProperty({
    example: 'Doe',
    description: 'provide the lastName of the user',
  })
  @Column()
  lastName: string;

  @ApiProperty({
    example: 'john_doe@gmail.com',
    description: 'Provide the email of the user',
  })
  @Column({ unique: true })
  email: string;

  @ApiProperty({
    example: 'test123#@',
    description: 'Provide the password of the user',
  })
  @Column()
  @Exclude()
  password: string;

  /**
   * A user can create many playLists
   */
  @OneToMany(() => Playlist, (playList) => playList.user)
  playLists: Playlist[];

  @Column({ nullable: true, type: 'text' })
  twoFASecret: string | null;

  @Column({ default: false, type: 'boolean' })
  enable2FA: boolean;

  @Column()
  apiKey: string;
}
