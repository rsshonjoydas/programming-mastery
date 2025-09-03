import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import { TypedConfigService } from '@/common/config/config.service';
import { ArtistsModule } from '@/modules/artists/artists.module';
import { ApiKeyStrategy } from '@/modules/auth/api-key.strategy';
import { AuthController } from '@/modules/auth/auth.controller';
import { AuthService } from '@/modules/auth/auth.service';
import { JWTStrategy } from '@/modules/auth/jwt.strategy';
import { UsersModule } from '@/modules/users/users.module';

@Module({
  imports: [
    UsersModule,
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => {
        const appConfig = configService.get('app');
        return {
          secret: appConfig.jwt.secret,
          signOptions: {
            expiresIn: appConfig.jwt.expiresIn,
          },
        };
      },
      inject: [ConfigService],
    }),
    ArtistsModule,
  ],
  providers: [AuthService, JWTStrategy, TypedConfigService, ApiKeyStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
