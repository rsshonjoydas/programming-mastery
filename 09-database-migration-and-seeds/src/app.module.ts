import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';
import { TypedConfigService } from '@/common/config/config.service';
import { appConfig } from '@/common/config/configuration';
import { validateEnvironment } from '@/common/config/env.validation';
import { ArtistsModule } from '@/modules/artists/artists.module';
import { AuthModule } from '@/modules/auth/auth.module';
import { PlayListModule } from '@/modules/playlists/playlists.module';
import { SeedModule } from '@/modules/seed/seed.module';
import { SongsController } from '@/modules/songs/songs.controller';
import { SongsModule } from '@/modules/songs/songs.module';
import { UsersModule } from '@/modules/users/users.module';
import { LoggerMiddleware } from '@/shared/interceptors/logger.middleware';
import { dataSourceOptions } from 'db/data-source';

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

    // TypeOrmModule.forRootAsync({
    //   imports: [ConfigModule],
    //   useFactory: (configService: ConfigService) => ({
    //     type: 'postgres',
    //     host: configService.get<string>('POSTGRES_HOST'),
    //     port: configService.get<number>('POSTGRES_PORT'),
    //     username: configService.get<string>('POSTGRES_USER'),
    //     password: configService.get<string>('POSTGRES_PASSWORD'),
    //     database: configService.get<string>('POSTGRES_DB'),
    //     entities: [Song, Artist, User, Playlist],
    //     synchronize: configService.get<string>('NODE_ENV') === 'development',
    //   }),
    //   inject: [ConfigService], // Fixed: inject ConfigService to match the parameter
    // }),
    TypeOrmModule.forRoot(dataSourceOptions),

    // ... other modules
    SongsModule,
    PlayListModule,
    AuthModule,
    UsersModule,
    ArtistsModule,
    SeedModule,
  ],
  controllers: [AppController],
  providers: [AppService, TypedConfigService],
  exports: [TypedConfigService],
})
export class AppModule implements NestModule {
  constructor(private dataSource: DataSource) {
    console.log(dataSource.driver.database);
  }

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes(SongsController);
  }
}
