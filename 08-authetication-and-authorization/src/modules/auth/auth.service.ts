import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { instanceToPlain } from 'class-transformer';

import { LoginDTO } from './dto/login.dto';

import { User } from '@/modules/users/user.entity';
import { UsersService } from '@/modules/users/users.service';

@Injectable()
export class AuthService {
  constructor(private userService: UsersService) {}

  async login(loginDTO: LoginDTO): Promise<User> {
    const user = await this.userService.findOne(loginDTO);
    const passwordMatched = await bcrypt.compare(
      loginDTO.password,
      user.password,
    );

    if (passwordMatched) {
      return instanceToPlain(user) as User; // Assumes @Exclude on password in User entity
    } else {
      throw new UnauthorizedException('Password does not match');
    }
  }
}
