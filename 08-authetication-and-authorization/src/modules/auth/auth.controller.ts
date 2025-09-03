import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { instanceToPlain } from 'class-transformer';
import { UpdateResult } from 'typeorm';

import { AuthService } from './auth.service';
import { LoginDTO } from './dto/login.dto';
import { ValidateTokenDTO } from './dto/validate-token.dto';
import { JwtAuthGuard } from './jwt.guard';

import type { Enable2FAType, JwtPayload } from './auth.type';

import { CreateUserDTO } from '@/modules/users/dto/create-user.dto';
import { User } from '@/modules/users/user.entity';
import { UsersService } from '@/modules/users/users.service';
import { CurrentUser } from '@/shared/decorators/current-user.decorator';

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

  // @Get('enable-2fa')
  // @UseGuards(JwtAuthGuard)
  // enable2FA(
  //   @Request()
  //   req,
  // ): Promise<Enable2FAType> {
  //   console.log(req.user);
  //   return this.authService.enable2FA(+req.user.userId);
  // }

  @Get('enable-2fa')
  @UseGuards(JwtAuthGuard)
  enable2FA(@CurrentUser('userId') userId: number): Promise<Enable2FAType> {
    return this.authService.enable2FA(userId);
  }

  @Post('validate-2fa')
  @UseGuards(JwtAuthGuard)
  validate2FA(
    @CurrentUser('userId') userId: number,
    ValidateTokenDTO: ValidateTokenDTO,
  ): Promise<{ verified: boolean }> {
    return this.authService.validate2FAToken(userId, ValidateTokenDTO.token);
  }

  @Get('disable-2fa')
  @UseGuards(JwtAuthGuard)
  disable2FA(@CurrentUser('userId') userId: number): Promise<UpdateResult> {
    return this.authService.disable2FA(userId);
  }

  // @Get('profile')
  // @UseGuards(AuthGuard('bearer'))
  // getProfile(
  //   @Request()
  //   req,
  // ) {
  //   delete req.user.password;
  //   return {
  //     msg: 'authenticated with api key',
  //     user: req.user,
  //   };
  // }

  @Get('profile')
  @UseGuards(AuthGuard('bearer'))
  getProfile(@CurrentUser() user: JwtPayload) {
    // return user;
    return instanceToPlain(user) as User;
  }
}
