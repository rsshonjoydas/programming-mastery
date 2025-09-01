import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';
import { TypedConfigService } from '@/common/config/config.service';
import { appConfig } from '@/common/config/configuration';
import { validateEnvironment } from '@/common/config/env.validation';
import { Artist } from '@/modules/artists/artist.entity';
import { AuthModule } from '@/modules/auth/auth.module';
import { Playlist } from '@/modules/playlists/playlist.entity';
import { PlayListModule } from '@/modules/playlists/playlists.module';
import { Song } from '@/modules/songs/song.entity';
import { SongsController } from '@/modules/songs/songs.controller';
import { SongsModule } from '@/modules/songs/songs.module';
import { User } from '@/modules/users/user.entity';
import { UsersModule } from '@/modules/users/users.module';
import { LoggerMiddleware } from '@/shared/interceptors/logger.middleware';

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

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('POSTGRES_HOST'),
        port: configService.get<number>('POSTGRES_PORT'),
        username: configService.get<string>('POSTGRES_USER'),
        password: configService.get<string>('POSTGRES_PASSWORD'),
        database: configService.get<string>('POSTGRES_DB'),
        entities: [Song, Artist, User, Playlist],
        synchronize: true, // Warning: Use only in development
      }),
      inject: [ConfigService],
    }),

    // ... other modules
    SongsModule,
    PlayListModule,
    AuthModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService, TypedConfigService],
})
export class AppModule implements NestModule {
  constructor(private dataSource: DataSource) {
    console.log(dataSource.driver.database);
  }

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes(SongsController);
  }
}
