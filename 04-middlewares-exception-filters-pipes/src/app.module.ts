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
    // Option No: 1. Specific path
    // consumer.apply(LoggerMiddleware).forRoutes('songs');

    // Option No: 2. Specific path & method
    // consumer
    //   .apply(LoggerMiddleware)
    //   .forRoutes({ path: 'songs', method: RequestMethod.POST });

    // Option No: 3. Specific Controller
    consumer.apply(LoggerMiddleware).forRoutes(SongsController);
  }
}
