import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

import { JwtPayload } from './auth.type';

@Injectable()
export class JwtArtistGuard extends AuthGuard('jwt') {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    return super.canActivate(context);
  }
  handleRequest<TUser = JwtPayload>(err: any, user: JwtPayload): TUser {
    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    console.log(user);
    if (user.artistId) {
      return user as unknown as TUser;
    }
    throw err || new UnauthorizedException();
  }
}
