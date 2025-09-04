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
