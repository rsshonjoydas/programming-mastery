# PostgreSQL Relations

## One to One Relation

One-to-one is a relational database design pattern where entity A contains only one instance of entity B, and vice versa, ensuring a bijective mapping. In a Nest.js application with `TypeORM`, this might manifest as a user entity having a one-to-one relation with an artist entity, meaning a user can become an artist, and an artist can have only a single user profile. This design is governed by the Single Responsibility Principle, as each entity is responsible for a distinct set of attributes and behaviors, thereby simplifying database management and application logic.

### Create Artist Entity

`artist.entity.ts`

```tsx
import { Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('artists')
export class Artist {
  @PrimaryGeneratedColumn()
  id: number;
}
```

Define the Artist entity starting with one field, using the `@Entity` decorator to map it to a database table. Extend the entity by adding more columns or fields as needed, guided by the application’s requirements and domain model. This flexibility allows you to tailor the entity to fit various use cases.

### **Create User Entity**

`user.entity.ts`

```tsx
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;
}
```

Create a User entity in the application, including fields for `firstName`, `lastName`, `email`, and `password`. Use appropriate data types and decorators to define these fields.

### **Add One to One Relation**

```tsx
@Entity('artists')
export class Artist {
  // A user can register as an artist
  // Each artist will have only a user profile
  @OneToOne(() => User)
  @JoinColumn()
  user: User;
}
```

Utilize TypeORM’s @OneToOne decorator to specify the target relation type, which in this case is User. Include the @JoinColumn to ensure that the Artist entity possesses the relation ID or foreign key; this will result in the Artist table having `userId` as a foreign key.

### Register User and Artist in `AppModule`

```tsx
entities: [Song, Artist, User],
```

Register the newly created entities in the `TypeORM` module to integrate them into your Nest.js application. This can be done within the `AppModule`, making it a focal point for configuring these database entities. Following the Dependency Injection design pattern, this allows your application to be extensible and maintainable by centralizing the registration process.

## **Many to Many Relation**

Establish a many-to-many relationship when a single instance of Entity A can be associated with multiple instances of Entity B and vice versa. In a musical platform built with Nest.js, consider that many artists can publish many songs, and similarly, a single song can belong to multiple artists. This relationship exemplifies the concept of high cardinality in database design, ensuring that your data structure can capture complex associations without redundancy.

### **Add Many to Many Relation in Artist**

`artist.entity.ts`

```tsx
@Entity('artists')
export class Artist {
  @OneToOne(() => User)
  @JoinColumn()
  user: User;

  @ManyToMany(() => Song, (song) => song.artists)
  songs: Song[];
}
```

Add the `@ManyToMany` relation in the Artist entity. The first argument specifies the target entity, and the second argument represents the inverse side of the relationship.

### **Add Many to Many Relation in Song**

```tsx
@Entity('songs')
export class Song {
  // @Column('varchar', { array: true })
  // artists: string[];
  @ManyToMany(() => Artist, (artist) => artist.songs, { cascade: true })
  @JoinTable({ name: 'songs_artists' })
  artists: Artist[];
}
```

Refactor the Artist's column; storing it as an array of strings is unnecessary. Instead, use the `@ManyToMany` annotation to define a relationship with another entity, specifying the target entity as the first argument and the inverse side as the second argument, found in the songs property within the Artist entity.

For cascading actions, use the cascade: `boolean | ("insert" | "update")[]` parameter. Setting it to true will automatically manage the related object's insertion and updates. Specific cascade options can also be set as an array.

Include the @JoinTable() annotation, which is mandatory for `@ManyToMany` relationships. Optionally, rename the Join Table to create a table named `songs_artists` in the database. This table will house the primary keys from both the songs and artists tables, functioning as foreign keys.

Here, the @ManyToMany and @JoinTable() annotations are typical of `TypeORM`, which Nest.js leverages for database operations. The cascade option is an example of the software engineering principle of DRY (Don't Repeat Yourself), as it automates CRUD operations for related entities. Meanwhile, the joined table is a clear manifestation of the database normalization principle, optimizing the data structure.

**Refactor `CreateSongDTO`**

```tsx
//@IsString({ each: true })
@IsNumber({}, { each: true })
readonly artists;
```

Expect an array of numbers, not strings, from the network request object when creating a new song. In the API request to create a song, provide the artist IDs. Use these IDs to query all corresponding artists from the database and establish a relationship with the newly created song.

In this context, using artist IDs instead of strings offers type safety and ensures data integrity, which is a cornerstone of reliable software design. The architecture of expecting IDs and establishing relations through them is often part of the RESTful API design pattern, which aims for stateless client-server communication. Nest.js makes it convenient to handle these types of operations through its integration with `TypeORM`, a powerful Object-Relational Mapping (ORM) library.

**Refactor `UpdateSongDTO`**

```tsx
// @IsString({ each: true })
@IsNumber({}, { each: true })
readonly artists;
```

Refactor the artists field in the `CreateSongDTO`.

**Register the Artist Entity in `SongsModule`**

```tsx
@Module({
  imports: [TypeOrmModule.forFeature([Song, Artist])],
  controllers: [SongsController],
  providers: [SongsService],
})
```

Include the Artist entity in `songs.service.ts` to utilize the `ArtistRepository`.

**Refactor the Create Song Method:**

```tsx
@Injectable()
export class SongsService {
  constructor(
    @InjectRepository(Song)
    private songsRepository: Repository<Song>,
    @InjectRepository(Artist)
    private artistsRepository: Repository<Artist>,
  ) {}

  async create(songDTO: CreateSongDTO): Promise<Song> {
    // Create song entity using repository.create() for cleaner instantiation
    const song = this.songRepository.create({
      title: songDTO.title,
      duration: songDTO.duration,
      lyrics: songDTO.lyrics,
      releasedDate: songDTO.releasedDate,
    });

    // Handle artist relationships if artists are provided
    if (songDTO.artists && songDTO.artists.length > 0) {
      const artists = await this.artistsRepository.findBy({
        id: In(songDTO.artists),
      });
      song.artists = artists;
    }

    return await this.songRepository.save(song);
  }
}
```

**`Recommended`**

```tsx
@Injectable()
export class SongsService {
  constructor(
    @InjectRepository(Song)
    private songsRepository: Repository<Song>,
    @InjectRepository(Artist)
    private artistsRepository: Repository<Artist>,
  ) {}

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
}
```

Find the artists by retrieving the ids from the DTO object and set these to the song entity. Save the changes in the songs repository; this will automatically establish a relation in the joined table `songs_artists`.

**`Recommended`**

Refactor the Update Song Method when using `@nestjs/mapped-typed` package

```tsx
@Injectable()
export class SongsService {
  constructor(
    @InjectRepository(Song)
    private songRepository: Repository<Song>,
    @InjectRepository(Artist)
    private artistsRepository: Repository<Artist>,
  ) {}
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
}
```

Refactor also `songs.controller.ts` file update method

```tsx
  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSongDTO: UpdateSongDTO,
  ): Promise<Song> {
    return this.songsService.update(id, updateSongDTO);
  }
```

### **Test the Application**

To test the application, ensure that artist and user records are present in the database. If they are not, manually create these records. For testing purposes, establish relationships between at least two users and two artists.

**Create new song Request:**

```json
POST http://localhost:3000/songs

{
 "title": "You for Me 3",
 "artists": [1, 2],
 "releasedDate": "2022-09-30",
 "duration": "02:45",
 "lyrics": "Sby, you're my adrenaline. Brought out this other side of me You don't even know Controlling my whole anatomy, oh Fingers are holding you right at the edge You're slipping out of my hands Keeping my secrets all up in my head I'm scared that you won't want me back, oh I dance to every song like it's about ya I drink 'til I kiss someone who looks like ya I wish that I was honest when I had you I shoulda told you that I wanted you for me I dance to every song like it's about ya I drink 'til I kiss someone who looks like ya"
}
```

## **One to Many Relation**

Define a Many-to-One/One-to-Many relationship in your entities to model scenarios where Entity A can have multiple instances of Entity B, but Entity B contains only one instance of Entity A. For example, each Playlist entity could have multiple Song entities, and each User entity can have multiple Playlist entities, while each Playlist belongs to a single User.

In Nest.js, leverage `TypeORM`'s @ManyToOne and @OneToMany decorators to annotate these relationships in your entities. This enables Nest.js to automatically manage the relations through its underlying ORM capabilities.

From a software engineering standpoint, this design pattern enforces the Single Responsibility Principle (SRP) by clearly defining and separating the responsibilities of each entity. It ensures that each entity only manages the data and relationships that are directly relevant to it, thereby making the system easier to understand, debug, and maintain.

### **Create a Playlist Entity and add Relations**

```tsx
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
```

Add a `@OneToMany` relationship between the song and the playlist, as well as a `@ManyToOne` relationship between the playlist and the user. The playlist table will include `userId` as a foreign key.

### **Add Many to One Relation in Song Entity**

```tsx
@Entity('songs')
export class Song {
  /**
   * Many songs can belong to playlist for each unique user
   */
  @ManyToOne(() => Playlist, (playList) => playList.songs)
  playList: Playlist;
}
```

This Song entity will have the `playlistId` as a foreign key in the songs table.

### **Add One to Many Relation in User**

```tsx
@Entity('users')
export class User {
  /**
   * A user can create many playLists
   */
  @OneToMany(() => Playlist, (playList) => playList.user)
  playLists: Playlist[];
}
```

### **Create `PlayList` Module**

```tsx
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
```

Treat the `PlayListModule` as a feature module within your Nest.js application. In the context of software modularization, a feature module encapsulates specific functionalities, allowing for clean separation of concerns. By adopting this approach, you're following the Single Responsibility Principle, making the application easier to understand, develop, and test.

### **Create `PlayList` Service**

```tsx
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
```

### **Create a Data Transfer Object DTO for the Playlist**

```tsx
import { IsArray, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreatePlayListDto {
  @IsString()
  @IsNotEmpty()
  readonly name;

  @IsNotEmpty()
  @IsArray()
  @IsNumber({}, { each: true })
  readonly songs;

  @IsNumber()
  @IsNotEmpty()
  readonly user: number;
}
```

To create a `PlayList`, send a request that includes the name, an array of song IDs, and a user ID. Ensure that these parameters are formatted correctly in the request payload.

### **Create `PlayListsController`**

```tsx
import { Body, Controller, Post } from '@nestjs/common';

import { CreatePlayListDTO } from './dto/create-playlist.dto';
import { Playlist } from './playlist.entity';
import { PlayListsService } from './playlists.service';

@Controller('playlists')
export class PlayListsController {
  constructor(private playListService: PlayListsService) {}
  @Post()
  create(
    @Body()
    playlistDTO: CreatePlayListDTO,
  ): Promise<Playlist> {
    return this.playListService.create(playlistDTO);
  }
}
```

Create an endpoint to facilitate the addition of a new playlist. Enable the end user to send a `POST` request to localhost:3000/playlists for this purpose. Ensure that `PlaylistRepository`, `SongRepository`, and `UserRepository` are available in the `PlayListService`.

### **Register the `PlayList` Module in `AppModule`**

```tsx
@Module({
  imports: [
    TypeOrmModule.forRoot({
      // previous...
      entities: [Song, Artist, User, Playlist],
    }),
    SongsModule,
    PlayListModule,
  ],
  // previous...
})
// previous...
```

Register the Playlist entity in the entities array. This step is essential for Nest.js to recognize the entity and make it available for database operations. It aligns with the software engineering principle of modularization, allowing each entity to serve as an isolated module within the larger application structure.

### Test the Application

You can test the application by sending the `POST` API request to <http://localhost:3000/playlists>. You also have to provide the JSON body to save the playlist record

```json
{
  "name": "Feel Good Now",
  "songs": [3],
  "user": 2
}
```
