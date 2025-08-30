# PostgreSQL with Type ORM

In this lesson, the application will be connected to a `database`, utilizing `TypeORM` as the bridge between object-oriented code and SQL queries in a Nest.js context. As a best practice, isolating database connection configurations into environment variables ensures both security and easier environment management. Learning how to connect Nest.js applications to a Postgres database provides a comprehensive understanding of backend architecture, an area where Nest.js offers more out of the-box features compared to Express.

## PostgreSQL Database Setup

### Install some dependencies

```bash
pnpm i @nestjs/typeorm pg typeorm
```

### Import `TypeORM` Module to App Module

`AppModule` is our root module, we have to configure the `TypeORM` module here

`app.module.ts`

```tsx
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      database: 'spotify-clone',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'root',
      entities: [], // add entity
      synchronize: true,
    }),
    SongsModule,
  ],
```

**OR using `env` config**

```tsx
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('POSTGRES_HOST'),
        port: configService.get<number>('POSTGRES_PORT'),
        username: configService.get<string>('POSTGRES_USER'),
        password: configService.get<string>('POSTGRES_PASSWORD'),
        database: configService.get<string>('POSTGRES_DB'),
        entities: [],
        synchronize: true, // Warning: Use only in development
      }),
      inject: [ConfigService],
    }),
```

- Importing the `TypeORM` module into `AppModule` requires calling the `forRoot` method. `NestJS` streamlines manual configuration for integrating with databases by providing built-in methods like `forRoot` that make it easier to set up a database connection. As a best practice, separating database connection logic into a dedicated configuration file is advised for easier management and scalability.
- The setting synchronize: true is risky for production as it can result in data loss. As a good practice, maintaining separate configurations for development and production environments ensures database integrity.
- After creating a new entity, it must be added to a specified array. `NestJS` promotes organization by having entities declared in a central location. A best practice is to maintain an index or a barrel file that exports all entities, thus making it easier to manage them.
- The `forRoot()` method accepts all configuration properties exposed by the `DataSource` constructor in the `TypeORM` package. As a good practice, encapsulating these settings in environment variables offers both security and ease of management.
- Providing a username and DB password is essential, and no database with the name n-test will exist by default. In `NestJS`, tools like PG-ADMIN allow for a graphical interface to interact with the Postgres Database. A good practice is to use a secure vault or environment variables for storing sensitive information like usernames and passwords.

### Test the DB Connection

`app.module.ts`

```tsx
export class AppModule implements NestModule {
  constructor(private dataSource: DataSource) {
    console.log(dataSource.driver.database);
  }
}
```

Testing the database connection can be accomplished by injecting the `datasource` class into `AppModule`, followed by logging the name of the database. Upon running the application, the database name will appear in the logs, signifying a successful connection between the `NestJS` application and the database.

Utilizing dependency injection for the `datasource` class promotes a modular and easily testable codebase, aligning with industry best practices. Additionally, logging crucial steps, such as successful database connections, aids in debugging and monitoring, also considered a best practice

## Entity

### **Create an Entity**

Entity is a class that maps to a database table, or to a collection when using `MongoDB`. In the context of `NestJS`, which often pairs with Object-Relational Mapping tools like `TypeORM`, an entity functions as the data model for the application, interfacing directly with the database schema. This exemplifies the software engineering principle of data source abstraction, allowing for easier swapping of databases or migration. As a best practice, encapsulating database interactions within repository classes streamlines code maintenance and enhances testability.

`song.entity.ts`

```tsx
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('songs')
export class Song {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column('varchar', { array: true })
  artists: string[];

  @Column('date')
  releasedDate: Date;

  @Column('time')
  duration: Date;

  @Column('text')
  lyrics: string;
}
```

In the class Entity: `@Entity('songs')` indicates that songs is the name of the database table. `@PrimaryGeneratedColumn()` serves to automatically increment the primary key, a feature that may be specified either here or directly within the database. `@Column()` defines a column, allowing specification of various data types such as `date`, `varchar`, and `time`. This column definition offers precise mapping, crucial for efficient data querying and comprehensive schema definition.

```tsx
 @Column('varchar', { array: true })
 artists: string[];
```

An array of artists exists, serving as a data structure to hold multiple artist entities. To create this array field in a Postgres database, metadata is added to the `@Column` decorator in the `NestJS` application. As a best practice, strongly typing this array—for instance, as `string[]`—can improve code maintainability and reduce potential runtime errors. In addition, leveraging Postgres’ native array data type within the `@Column` decorator provides optimizations for array operations and queries.

```tsx
@Column({ type: 'date' })
releasedDate: Date;
```

The date type is specified for the release date, ensuring that no time-related properties are added to the `releasedDate` field. In `NestJS`, using class-validator’s `@IsDate()` decorator on the `releasedDate` property would further enforce type safety and validation, adhering to best practices for robust, production-ready code

```tsx
@Column({ type: 'time' })
duration: Date;
```

The duration field is configured with the date type, which might imply that it should hold date-related data. However, despite this type declaration, the field will exclusively contain time information because the specific type has been set to time. As a best practice in `NestJS`, explicitly naming the database column and its type using the `@Column` decorator can avoid ambiguity and make the code more maintainable. Additionally, using `type guards` or `DTOs (Data Transfer Objects)` with class-validator can ensure that the data in this field adheres to the intended time format, enhancing data integrity.

```tsx
@Column({ type: 'text' })
lyrics: string;
```

To accommodate a long string or text, the text type in Postgres is appropriate. This stands in contrast to shorter text, for which the varchar type would be suitable.

### **Register the Entity in `AppModule`**

To integrate the Song Entity with the application, include it in the `AppModule` by updating the `TypeORM` module. Specifically, add the Song Entity to the entities array within the `forRoot` method. `NestJS` allows seamless integration of entities via its modular structure. As a best practice, organizing the entities in a dedicated configuration file can enhance modularity and ease of management.

`app.module.ts`

```tsx
entities: [Song],
```

### **Test the Application**

Upon running the application, the songs table appears in the n-test database. These fields materialize automatically, an outcome facilitated by `NestJS`’s integration with `TypeORM`, which handles database migrations and schema synchronization. A best practice involves leveraging `NestJS`’s built-in Dependency Injection system for all database interactions, ensuring a modular and testable codebase.

## **Create and Fetch Records from DB**

### **Repository Pattern**

`TypeORM` supports the repository design pattern, so each entity has its own repository. In `NestJS`, this adherence to the repository pattern facilitates cleaner, more modular code by separating the database logic from business logic, aligning with software engineering best practices.

These repositories can be obtained from the database data source. In a `NestJS` application, you usually inject these repositories into your services or controllers via Dependency Injection, enabling direct interaction with the database through methods like `find`, `save`, or `delete`.

`songs.module.ts`

```tsx
@Module({
  imports: [TypeOrmModule.forFeature([Song])],
  controllers: [SongsController],
  providers: [SongsService],
})
```

To use the `SongRepository` we need to import the `TypeORM` module into the `songs.module.ts` file. This module uses the `forFeature()` method to define which repositories are registered in the current scope. With that in place, we can inject the `SongRepository` into the `SongService` using the `@InjectRepository()` decorator:

`songs.service.ts`

```tsx
import { InjectRepository } from '@nestjs/typeorm';

import { Song } from './song.entity';

@Injectable()
export class SongsService {
  constructor(
    @InjectRepository(Song)
    private songRepository: Repository<Song>,
  ) {}
  // previous code...
}
```

`SongRepository` provides `CRUD` methods to create, delete, update, and fetch records from the Songs table. In a `NestJS` application, this specialized repository is responsible for handling all operations related to the Songs entity, abstracting the database interactions and thus adhering to the repository best practice.

### **Create Record**

Now, you should implement the create song method. This time, there is no need to add a record in the local `db` array. Save the new song in the database by using the `songRepository.save()` method

`songs.service.ts`

```tsx
  async create(songDTO: CreateSongDTO): Promise<Song> {
    const song = new Song();
    song.title = songDTO.title;
    song.artists = songDTO.artists;
    song.duration = songDTO.duration;
    song.lyrics = songDTO.lyrics;
    song.releasedDate = songDTO.releasedDate;
    return await this.songRepository.save(song);
  }
```

**`OR` use this shortcut**

```tsx
  async create(songDTO: CreateSongDTO): Promise<Song> {
    const song = this.songRepository.create(songDTO);
    return await this.songRepository.save(song);
  }
```

Instantiate a new song instance from the Song Entity. Set the fields of the songs table using the DTO object, and finally, return a promise containing the song object from the create method.

A database promise is essential for handling asynchronous operations when interacting with a database. In a web application, tasks like `querying`, updating, or `deleting` records are not instantaneous and can take an undefined amount of time to complete. Utilizing promises allows your application to continue executing other tasks while waiting for the database operation to resolve, thereby improving performance and user experience.

In the context of `NestJS` and `TypeORM`, methods like save(), find(), or delete() often return promises. By defining a return type like `Promise<Song[]>` in your service or controller methods, you make it explicit that the function is asynchronous and will return data at a future point in time. This is particularly beneficial for type-checking and for setting the expectations for the developers who will consume these methods.

`songRepository` provides the save method to save the record in a database table. You have to provide the instance of the entity which entity record you want to save.

`songs.controller.ts`

```tsx
  @Post()
  create(@Body() createSongDTO: CreateSongDTO): Promise<Song> {
    return this.songsService.create(createSongDTO);
  }
```

Add the return type for the create method, which is a promise containing the Song entity.
