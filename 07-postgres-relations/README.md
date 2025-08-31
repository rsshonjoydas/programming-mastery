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
