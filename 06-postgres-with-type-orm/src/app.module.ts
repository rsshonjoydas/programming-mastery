import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';
import { TypedConfigService } from '@/common/config/config.service';
import { appConfig } from '@/common/config/configuration';
import { validateEnvironment } from '@/common/config/env.validation';
import { SongsController } from '@/modules/songs/songs.controller';
import { SongsModule } from '@/modules/songs/songs.module';
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

    // ... other modules
    SongsModule,
  ],
  controllers: [AppController],
  providers: [AppService, TypedConfigService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes(SongsController);
  }
}
