# MongoDB Database

MongoDB serves as an open-source NoSQL database management program, particularly adept at handling extensive sets of distributed data. Learning to integrate MongoDB within a Nest.js application involves using the Mongoose package, which is recommended for its robust modeling and validation tools that are absent in the native driver.

Mongoose operates as an object-oriented JavaScript library that facilitates a connection between MongoDB and the Node.js runtime environment. It simplifies the interaction with MongoDB by providing schema validation and the ability to translate between objects in code and their representation within MongoDB, which is a best practice for maintaining data integrity and consistency.

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

@Schema()
export class Song {
  @Prop({
    required: true,
  })
  title: string;
  @Prop({
    required: true,
  })
  releasedDate: Date;
  @Prop({
    required: true,
  })
  duration: string;

  lyrics: string;
}

export const SongSchema = SchemaFactory.createForClass(Song);
```

1. The `SongDocument` is utilized upon injecting the Model into the `SongService`. It is a NestJS-specific approach to apply TypeScript interfaces for Mongoose models, promoting type safety and IntelliSense in the service layer.
2. Applying the `@Schema()` decorator designates a class as a schema definition, associating the Song class with a MongoDB collection named songs. This decorator is part of `NestJS`'s `Mongoose` integration, which simplifies working with `MongoDB` by automatically pluralizing the model name for the collection.
3. The `@Prop()` decorator is employed to declare a property within the document. This decorator is crucial in defining the schema's data structure and ensuring the fields align with the intended types in the MongoDB collection.
4. `SchemaFactory` is tasked with generating the bare schema definition. Employing `console.log` on `SongSchema` will reveal the structured outcome, demonstrating the schema's conversion to a format that `Mongoose` can use to enforce document structure in `MongoDB`.
