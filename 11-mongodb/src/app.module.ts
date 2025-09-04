import { Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { InjectConnection, MongooseModule } from '@nestjs/mongoose';
import { ConnectionStates } from 'mongoose';

import type { Connection } from 'mongoose';

import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';
import { TypedConfigService } from '@/common/config/config.service';
import { appConfig } from '@/common/config/configuration';
import { validateEnvironment } from '@/common/config/env.validation';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      expandVariables: true,
      envFilePath: ['.env.local', `.env.${process.env.NODE_ENV}`, '.env'],
      load: [appConfig],
      validate: validateEnvironment,
    }),
    // ... other modules
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
