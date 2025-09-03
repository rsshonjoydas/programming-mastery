import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';

import { AuthService } from './auth.service';
import { Enable2FAType } from './auth.type';
import { LoginDTO } from './dto/login.dto';
import { JwtAuthGuard } from './jwt.guard';

import { CreateUserDTO } from '@/modules/users/dto/create-user.dto';
import { User } from '@/modules/users/user.entity';
import { UsersService } from '@/modules/users/users.service';

@Controller('auth')
export class AuthController {
  constructor(
    private userService: UsersService,
    private authService: AuthService,
  ) {}
  @Post('register')
  signup(
    @Body()
    createUserDTO: CreateUserDTO,
  ): Promise<User> {
    return this.userService.create(createUserDTO);
  }

  @Post('login')
  login(
    @Body()
    loginDTO: LoginDTO,
  ) {
    return this.authService.login(loginDTO);
  }

  @Get('enable-2fa')
  @UseGuards(JwtAuthGuard)
  enable2FA(
    @Request()
    req,
  ): Promise<Enable2FAType> {
    console.log(req.user);
    return this.authService.enable2FA(+req.user.userId);
  }
}
