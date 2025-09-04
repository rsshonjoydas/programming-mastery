import { createParamDecorator } from '@nestjs/common';

import type { JwtPayload } from '@/modules/auth/auth.type';
import type { ExecutionContext } from '@nestjs/common';

// Define authenticated request interface
interface AuthenticatedRequest {
  user: JwtPayload;
}

// Simple version that requires manual typing
// export const CurrentUser = createParamDecorator(
//   (property?: keyof JwtPayload, ctx?: ExecutionContext) => {
//     const request = ctx!.switchToHttp().getRequest<AuthenticatedRequest>();
//     const user = request.user;

//     if (!user) {
//       throw new Error('User not found in request');
//     }

//     return property ? user[property] : user;
//   },
// );

// Generic version (most flexible)
export const CurrentUser = createParamDecorator(
  <T extends keyof JwtPayload>(property?: T, ctx?: ExecutionContext) => {
    const request = ctx!.switchToHttp().getRequest<AuthenticatedRequest>();
    const user = request.user;

    if (!user) {
      throw new Error('User not found in request');
    }

    return property ? user[property] : user;
  },
);
