import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { TypedConfigService } from '@/common/config/config.service';

interface JwtPayload {
  sub: string;
  email: string;
  iat?: number;
  exp?: number;
}

interface ValidatedUser {
  userId: string;
  email: string;
}

@Injectable()
export class JWTStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: TypedConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getJwtSecret(),
    });
  }

  validate(payload: JwtPayload): ValidatedUser {
    return { userId: payload.sub, email: payload.email };
  }
}
