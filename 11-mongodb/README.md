MongoDB serves as an open-source NoSQL database management program, particularly adept at handling extensive sets of distributed data. Learning to integrate MongoDB within a Nest.js application involves using the Mongoose package, which is recommended for its robust modeling and validation tools that are absent in the native driver.

Mongoose operates as an object-oriented JavaScript library that facilitates a connection between MongoDB and the Node.js runtime environment. It simplifies the interaction with MongoDB by providing schema validation and the ability to translate between objects in code and their representation within MongoDB, which is a best practice for maintaining data integrity and consistency.

## Project Setup

### Step 1: Create a new Project

Open your terminal and create a new project with `nest-cli`

```bash
nest new [project-name]
```

Choose any name for your project.

### Step 2: Install Dependencies

Install these two packages to connect with MongoDB database

```bash
pnpm install @nestjs/mongoose mongoose
```

## Connect with MongoDB

The previous lesson involved the installation of two packages, `@nestjs/mongoose` and mongoose, for MongoDB integration. The creation of a Mongoose Module within `AppModule` follows, demonstrating `NestJS`'s module-driven architecture which encapsulates functionality. It is considered a best practice to define schema models and their corresponding modules in separate files to enhance modularity and maintain a clear project structure.

`app.module.ts`

```tsx
@Module({
  imports: [MongooseModule.forRoot('mongodb://localhost:27017/spotify-clone')],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

### Advanced MongoDB Connection

```tsx
import { Module, OnModuleInit } from '@nestjs/common';
import { InjectConnection, MongooseModule } from '@nestjs/mongoose';
import { ConnectionStates } from 'mongoose';

import type { Connection } from 'mongoose';

import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';
import { TypedConfigService } from '@/common/config/config.service';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/spotify-clone', {
      // Optional: Add connection options
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
    }),
  ],
  controllers: [AppController],
  providers: [AppService, TypedConfigService],
})
export class AppModule implements OnModuleInit {
  constructor(@InjectConnection() private connection: Connection) {}

  onModuleInit() {
    this.connection.on('connected', () => {
      console.log('✅ MongoDB connected successfully');
      console.log(`📊 Database: ${this.connection.name}`);
      console.log(`🏠 Host: ${this.connection.host}:${this.connection.port}`);
    });

    this.connection.on('error', (error) => {
      console.error('❌ MongoDB connection error:', error.message);
    });

    this.connection.on('disconnected', () => {
      console.log('⚠️ MongoDB disconnected');
    });

    console.log(`🔍 MongoDB connection state: ${this.getConnectionState()}`);

    // ✅ Correct: Using ConnectionStates enum
    if (this.connection.readyState === ConnectionStates.connected) {
      console.log(`📂 Connected to database: ${this.connection.name}`);
      console.log(
        `🌐 MongoDB URI: mongodb://${this.connection.host}:${this.connection.port}`,
      );
    }
  }

  private getConnectionState(): string {
    switch (this.connection.readyState) {
      case ConnectionStates.disconnected:
        return 'disconnected';
      case ConnectionStates.connected:
        return 'connected';
      case ConnectionStates.connecting:
        return 'connecting';
      case ConnectionStates.disconnecting:
        return 'disconnecting';
      case ConnectionStates.uninitialized:
        return 'uninitialized';
      default:
        return 'unknown';
    }
  }
}
```

The `forRoot()` method in `NestJS`'s Mongoose module requires a configuration object analogous to the one used in `mongoose.connect()` from the `Mongoose` package. This method provides a streamlined approach to configuring the database connection at the root module level, ensuring all sub-modules can interact with the database consistently. A best practice entails validating the database connection parameters and handling connection errors gracefully to maintain the stability of the application.

## Create Schema

In Mongoose, everything commences with a Schema, which maps to a MongoDB collection and dictates the structure of the documents in that collection. Schemas serve to establish Models, with Models being accountable for the creation and retrieval of documents from the MongoDB database. Adopting Schemas and Models aligns with `NestJS`'s modular approach, enhancing maintainability and promoting adherence to an application's defined data architecture. Utilizing Mongoose with `NestJS` adheres to a best practice of encapsulating database interactions, which improves code reusability and testability.

`src/modules/songs/schemas/song.schema.ts`

```tsx
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type SongDocument = HydratedDocument<Song>;

@Schema({ timestamps: true }) // Adds createdAt and updatedAt automatically
export class Song {
  @Prop({
    required: true,
    trim: true,
  })
  title: string;

  @Prop({
    required: true,
  })
  releasedDate: Date;

  @Prop({
    required: true,
    trim: true,
  })
  duration: string; // Keep as string for formats like "3:45" or "03:45"

  @Prop({
    required: false, // Made optional since it wasn't marked as required
    default: '',
  })
  lyrics: string;
}

export const SongSchema = SchemaFactory.createForClass(Song);
```

1. The `SongDocument` is utilized upon injecting the Model into the `SongService`. It is a `NestJS`-specific approach to apply TypeScript interfaces for Mongoose models, promoting type safety and IntelliSense in the service layer.
2. Applying the `@Schema()` decorator designates a class as a schema definition, associating the Song class with a MongoDB collection named songs. This decorator is part of `NestJS`'s `Mongoose` integration, which simplifies working with `MongoDB` by automatically pluralizing the model name for the collection.
3. The `@Prop()` decorator is employed to declare a property within the document. This decorator is crucial in defining the schema's data structure and ensuring the fields align with the intended types in the MongoDB collection.
4. `SchemaFactory` is tasked with generating the bare schema definition. Employing `console.log` on `SongSchema` will reveal the structured outcome, demonstrating the schema's conversion to a format that `Mongoose` can use to enforce document structure in `MongoDB`.

## Save Record in MongoDB

The record must be saved in the MongoDB collection, necessitating the creation of a `POST` endpoint to store the songs. Utilizing `NestJS`'s `@Controller` and `@Post` decorators, the endpoint can be efficiently set up, showcasing the framework's streamlined approach to REST API development. It is considered a best practice to abstract the interaction with MongoDB into a service, which allows for cleaner controllers and easier maintenance of database operations.

### Step 1: Create Songs Module, Controller, and Service

```bash
nest g mo modules/songs && nest g co modules/songs && nest g s modules/songs
```

### Step 2: Create `CreateSongDTO`

**Install Dependencies**

```json
pnpm i class-transformer class-validator
```

`songs/dto/create-song.dto.ts`

```tsx
import { Transform } from 'class-transformer';
import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateSongDTO {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsDateString() // Validates ISO date string format
  // @Transform(({ value }) => new Date(value as string)) // Transforms string to Date
  @Transform(({ value }): Date | undefined => {
    if (value == null) return undefined;
    if (typeof value === 'string' || typeof value === 'number') {
      const date = new Date(value);
      if (isNaN(date.getTime())) {
        throw new Error('Invalid date format');
      }
      return date;
    }
    if (value instanceof Date) return value;
    throw new Error('Invalid date format');
  })
  releasedDate: Date;

  @IsNotEmpty()
  @IsString()
  duration: string; // Fixed: was Date, should be string for duration like "3:45"

  @IsOptional()
  @IsString()
  lyrics?: string; // Made optional with ? since it's not required in schema
}
```

### Step 3: Add a create method in `SongsService`

```tsx
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CreateSongDTO } from './dto/create-song.dto';
import { Song, SongDocument } from './schemas/song.schema';

@Injectable()
export class SongsService {
  constructor(
    @InjectModel(Song.name)
    private readonly songModel: Model<SongDocument>,
  ) {}

  async create(createSongDTO: CreateSongDTO): Promise<Song> {
    const song = await this.songModel.create(createSongDTO);
    return song;
  }
}
```

### Step 4: Add a create method in `SongsController`

```tsx
import { Body, Controller, Post } from '@nestjs/common';

import { CreateSongDTO } from './dto/create-song.dto';
import { SongsService } from './songs.service';

@Controller('songs')
export class SongsController {
  constructor(private songService: SongsService) {}

  @Post()
  create(
    @Body()
    createSongDTO: CreateSongDTO,
  ) {
    return this.songService.create(createSongDTO);
  }
}
```

1. Registration of the song model within the `SongsModule` allows for its injection into the service, demonstrating `NestJS`'s modular design that promotes loose coupling and high cohesion.
2. Utilization of the `SongDocument` type within the song schema file ensures that the object adheres to the defined schema, a practice that enforces type safety and reduces runtime errors.
3. The `songModel` incorporates a method to persist records in MongoDB, which illustrates the encapsulation of database operations within models, a practice that enhances maintainability and scalability of the application.

### Step 5: Register the Song Model in `SongsModule`

```tsx
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Song, SongSchema } from './schemas/song.schema';
import { SongsController } from './songs.controller';
import { SongsService } from './songs.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Song.name, schema: SongSchema }]), //1
  ],
  controllers: [SongsController],
  providers: [SongsService],
})
export class SongsModule {}
```

The `MongooseModule` employs the `forFeature()` method to configure itself, allowing specific models to be registered within the current scope. It is a `NestJS`-specific mechanism that ensures model encapsulation and modularity, a recommended approach for maintaining clean and manageable database-related code.

### Step 6: Test the Application

The application's functionality can tested. See if it works.

- `Method` : `POST`
- `URL` : [`http://localhost:3000/songs`](http://localhost:3000/songs)
- `Body` :

  ```json
  {
    "title": "Lasting Lover",
    "releasedDate": "2023-05-11",
    "duration": "02:33",
    "lyrics": "I don't know why I can't quite get you out my sight You're always just behind"
  }
  ```

## Get All Records

### Step 1: Create a new find method in `SongService`

A new find method is crafted within the `SongService`, encapsulating the logic for retrieving song data. As a best practice within `NestJS`, this method should be designed as a service that can be injected into controllers, promoting a clean separation of concerns and enhanced testability.

`songs.service.ts`

```tsx
async find(): Promise<Song[]> {
  return this.songModel.find();
}
```

### Step 2: Create a Route in `SongController`

A route in the `SongController` is established to handle specific music-related requests. In `NestJS`, it's advisable to use decorators like `@Get`, `@Post`, or `@Put` to clearly define the purpose and nature of the route, enhancing the readability and structure of the code.

`songs.controller.ts`

```tsx
@Get()
find(): Promise<Song[]> {
  return this.songService.find();
}
```

### Step 3: Test the Application

The application's functionality can tested. See if it works.

- `Method` : `GET`
- `URL` : [`http://localhost:3000/songs`](http://localhost:3000/songs)

## Get a Record

### Step 1: Create a `findById` method in `SongService`

The creation of a `findById` method within `SongService` serves to encapsulate the logic for retrieving a specific song by its identifier. Implementing such methods aligns with `NestJS`'s philosophy of modular services, ensuring that each service has a single responsibility and that the application remains scalable and maintainable. It is considered a best practice to abstract database queries within services to isolate them from controllers, thereby promoting clean separation of concerns.

```tsx
async findById(id: string): Promise<Song> {
  const song = await this.songModel.findById(id);
  if (!song) {
    throw new NotFoundException(`Song with id ${id} not found`);
  }
  return song;
}
```

### Step 2: Create `findOne` Route in `SongController`

The creation of a `findOne` route in the controller is implemented to facilitate the retrieval of a single song entity by its unique identifier. In `NestJS`, best practices suggest utilizing decorators like `@Get`with the route path and `@Param` to capture route parameters, enhancing the modularity and declarative nature of routing mechanisms.

```tsx
@Get(':id')
findOne(
  @Param('id')
  id: string,
): Promise<Song> {
  return this.songService.findById(id);
}
```

### Step 3: Test the Application

The application's functionality can tested. See if it works.

- `Method` : `GET`
- `URL` : [`http://localhost:3000/songs/:id`](http://localhost:3000/songs)

## Update a Record

### Step 1: Create `UpdateSongDTO`

`songs/dto/update-song.dto.ts`

```tsx
import { Transform } from 'class-transformer';
import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateSongDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  title?: string;

  @IsOptional()
  @IsDateString()
  // @Transform(({ value }) => new Date(value as string))
  @Transform(({ value }): Date | undefined => {
    if (value == null) return undefined;
    if (typeof value === 'string' || typeof value === 'number') {
      const date = new Date(value);
      if (isNaN(date.getTime())) {
        throw new Error('Invalid date format');
      }
      return date;
    }
    if (value instanceof Date) return value;
    throw new Error('Invalid date format');
  })
  releasedDate?: Date;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  duration?: string;

  @IsOptional()
  @IsString()
  lyrics?: string;
}
```

**`OR` using `@nestjs/mapped-types` package**

Then you can use `PartialType` to automatically make all fields from a base DTO optional

```bash
**pnpm add @nestjs/mapped-types**
```

Create another DTO object to update the record.

`songs/dto/update-song.dto.ts`

```tsx
import { PartialType } from '@nestjs/mapped-types';

import { CreateSongDTO } from './create-song.dto';

export class UpdateSongDTO extends PartialType(CreateSongDTO) {}
```

### Step 2: Create a update song method in `SongService`

```tsx
  async update(id: string, updateSongDto: UpdateSongDTO): Promise<Song> {
    const updatedSong = await this.songModel.findByIdAndUpdate(
      id,
      updateSongDto,
      {
        new: true, // Return updated document
        runValidators: true, // Run schema validators
      },
    );

    if (!updatedSong) {
      throw new NotFoundException(`Song with id ${id} not found`);
    }

    return updatedSong;
  }
```

### Step 3: Create a Route for updating a song in `SongController`

```tsx
  // PUT - Complete update (replaces entire document)
  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') id: string,
    @Body() updateSongDto: UpdateSongDTO,
  ): Promise<Song> {
    return this.songService.update(id, updateSongDto);
  }

  // PATCH - Partial update (updates only provided fields)
  // @Patch(':id')
  // @HttpCode(HttpStatus.OK)
  // async partialUpdate(
  //   @Param('id') id: string,
  //   @Body() updateSongDto: UpdateSongDTO,
  // ): Promise<Song> {
  //   return this.songService.update(id, updateSongDto);
  // }
```

### Step 4: Test the Application

The application's functionality can tested. See if it works.

- `Method` : `PUT`
- `URL` : [`http://localhost:3000/songs/:id`](http://localhost:3000/songs)

## Delete a Record

### Step 1: Create a delete song method in `SongService`

A delete song method within `SongService` can be established to handle removal operations for songs. Ensuring the method is idempotent, meaning it can be called multiple times without changing the result beyond the initial application, is considered a best practice for robust `API` design in `NestJS`applications.

```tsx
  async delete(id: string): Promise<DeleteResult> {
    return this.songModel.deleteOne({ _id: id });
  }
```

### Step 2: Create a Route for deleting a song in `SongController`

A route for deleting a song is established through a controller's method decorated with `NestJS`'s `@Delete()` decorator, which maps `HTTP DELETE` requests to the corresponding service function. In terms of best practices, implementing soft deletion, where records are flagged as inactive rather than removed from the database, can be advantageous for data recovery and audit purposes.

```tsx
  @Delete(':id')
  delete(
    @Param('id')
    id: string,
  ): Promise<DeleteResult> {
    return this.songService.delete(id);
  }
```

### Step 3: Test the Application

The application's functionality can tested. See if it works.

- `Method` : `DELETE`
- `URL` : [`http://localhost:3000/songs/:id`](http://localhost:3000/songs)

## Populate

This lesson covers the addition of relations between two models in Mongoose, illustrating the association where each song is linked to a single album and each album may encompass numerous songs. The demonstration focuses on Mongoose's populate feature, which is pivotal for managing document relationships in MongoDB, akin to JOINs in relational databases. `NestJS` supports Mongoose's features directly through its dedicated @nestjs/mongoose package, and employing populate is a common practice to efficiently retrieve related documents.

### Step 1: Create an album schema

A new folder named albums must be created to house the schema file. This action conforms to `NestJS`'s modular architecture, where separating concerns by feature enhances maintainability and scalability—a best practice in software development.

`src/modules/albums/schemas/album.schema.ts`

```tsx
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

import { Song } from '@/modules/songs/schemas/song.schema';

export type AlbumDocument = HydratedDocument<Album>;

@Schema({
  timestamps: true,
  collection: 'albums',
  versionKey: false, // This removes __v entirely
  // toJSON: {
  // virtuals: true,
  //   transform: (doc: Document, ret: Record<string, any>) => {
  //     delete ret.__v;
  //     return ret;
  //   },
  // transform: (doc, ret) => {
  //   delete (ret as any).__v;
  //   return ret;
  // },
  // },
  toObject: { virtuals: true },
})
export class Album {
  @Prop({
    required: true,
  })
  title: string;

  @Prop({ type: [Types.ObjectId], ref: 'songs' }) //1
  songs: Song[];
}

export const AlbumSchema = SchemaFactory.createForClass(Album);
```

1. The songs property is defined in the Album model with the type specified as an array of MongoDB `ObjectID`s, intended to store references to the IDs of the song collection within the albums table.
2. The ref attribute establishes a reference to the songs collection, enabling the creation of relational data structures within a MongoDB database, a feature `NestJS` leverages through its Mongoose module integration.

As a best practice, it is recommended to clearly document such relationships within the code to improve maintainability and provide clarity for future development efforts. Additionally, ensuring that the `ObjectID`s used in references are validated for their format can prevent runtime errors and maintain data integrity.

### Step 2: Add a relation in the song schema

Inclusion of a relation within the song schema can be executed through the use of decorators that define the relationship type, such as `@OneToMany` or `@ManyToOne`, which `NestJS` leverages from `TypeORM`. This practice encapsulates the relational aspect directly within the entity, thus promoting a clear and maintainable structure within the application’s domain model. Best practice dictates careful planning of entity relationships to optimize query performance and database integrity.

`song.schema.ts`

```tsx
@Prop({
  type: Types.ObjectId,
  ref: Album.name,
})
album: Album;
```

`create-song.dto.ts`

```tsx
  @IsNotEmpty()
  @IsString()
  @IsMongoId()
  album: string; // MongoDB ObjectId as string
```

### Step 3: Create album DTO

```tsx
import {
  ArrayMinSize,
  IsArray,
  IsMongoId,
  IsNotEmpty,
  IsString,
} from 'class-validator';

export class CreateAlbumDTO {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsArray()
  @ArrayMinSize(1)
  @IsMongoId({ each: true })
  songs: string[];
}
```

### Step 4: Create Album Module, Controller and Service

The creation of an Album Module, Controller, and Service in a `NestJS` application encapsulates the album-related functionalities, aligning with the framework's modular architecture. Implementing each as a separate entity follows `NestJS`'s single-responsibility principle, ensuring that the application remains scalable and maintainable. As a best practice, defining strict interfaces and DTOs (Data Transfer Objects) for service methods enhances type safety and validation, which is a crucial aspect of robust software design.

```bash
nest g mo modules/album && nest g co modules/album && nest g s modules/album
```

`albums.service.ts`

```tsx
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CreateAlbumDTO } from './dto/create-album.dto';
import { Album, AlbumDocument } from './schemas/album.schema';

import { Song } from '@/modules/songs/schemas/song.schema';

@Injectable()
export class AlbumService {
  constructor(
    @InjectModel(Album.name)
    private readonly albumModel: Model<AlbumDocument>,
  ) {}

  async createAlbum(createAlbumDTO: CreateAlbumDTO): Promise<Album> {
    return this.albumModel.create(createAlbumDTO);
  }

  async findAlbums() {
    return this.albumModel.find().populate('songs', null, Song.name);
  }
}
```

The populate method is applied on the album model to retrieve all songs associated with each album. Utilizing this feature in NestJS effectively allows for eager loading of related entities, which streamlines data retrieval processes. It is considered a good practice to carefully manage such operations to optimize query performance and maintain data integrity.

`albums.controller.ts`

```tsx
import { Body, Controller, Get, Post } from '@nestjs/common';

import { AlbumService } from './albums.service';
import { CreateAlbumDTO } from './dto/create-album.dto';
import { Album } from './schemas/album.schema';

@Controller('albums')
export class AlbumController {
  constructor(private albumService: AlbumService) {}

  @Post()
  create(
    @Body()
    createAlbumDTO: CreateAlbumDTO,
  ): Promise<Album> {
    return this.albumService.createAlbum(createAlbumDTO);
  }

  @Get()
  find(): Promise<Album[]> {
    return this.albumService.findAlbums();
  }
}
```

`albums.module.ts`

```tsx
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AlbumController } from './albums.controller';
import { AlbumService } from './albums.service';
import { Album, AlbumSchema } from './schemas/album.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Album.name, schema: AlbumSchema }]),
  ],
  controllers: [AlbumController],
  providers: [AlbumService],
})
export class AlbumModule {}
```

### Step 5: Test the Application

The application's functionality can tested. See if it works.

`Create Album`

- `Method` : `POST`
- `URL` : <http://localhost:3000/albums>
- `Body`:

  ```json
  {
    "title": "Dance",
    "songs": ["68b9a64249379400150737c9", "68b9b84b7b09010c385130ab"]
  }
  ```

`Get Albums`

- `Method` : `GET`
- `URL` : <http://localhost:3000/albums>
