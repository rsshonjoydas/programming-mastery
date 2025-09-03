import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import * as speakeasy from 'speakeasy';
import { UpdateResult } from 'typeorm';

import { Enable2FAType, JwtPayload } from './auth.type';
import { LoginDTO } from './dto/login.dto';

import { ArtistsService } from '@/modules/artists/artists.service';
import { UsersService } from '@/modules/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
    private artistsService: ArtistsService,
  ) {}

  async login(
    loginDTO: LoginDTO,
  ): Promise<
    { accessToken: string } | { validate2FA: string; message: string }
  > {
    const user = await this.userService.findOne(loginDTO);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordMatched = await bcrypt.compare(
      loginDTO.password,
      user.password,
    );

    if (!passwordMatched) {
      throw new UnauthorizedException('Invalid credentials'); // Generic message for security
    }

    const payload: JwtPayload = { email: user.email, userId: user.id };
    // find if it is an artist then the add the artist id to payload
    const artist = await this.artistsService.findArtist(user.id);
    if (artist) {
      payload.artistId = artist.id;
    }

    // If user has enabled 2FA and have the secret key then
    if (user.enable2FA && user.twoFASecret) {
      // sends the validateToken request link
      // else otherwise sends the json web token in the response
      return {
        validate2FA: 'http://localhost:3000/auth/validate-2fa',
        message:
          'Please send the one-time password/token from your Google Authenticator App',
      };
    }

    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  async enable2FA(userId: number): Promise<Enable2FAType> {
    // Find the user based on id
    const user = await this.userService.findById(userId);

    // Add null check for user
    if (!user) {
      throw new Error('User not found');
    }

    if (user.enable2FA) {
      // Handle the case where twoFASecret might be null
      if (!user.twoFASecret) {
        throw new Error('2FA is enabled but secret is missing');
      }
      return { secret: user.twoFASecret };
    }

    const secret = speakeasy.generateSecret();
    console.log(secret);
    const secretBase32 = secret.base32 as string;
    user.twoFASecret = secretBase32;
    await this.userService.updateSecretKey(user.id, secretBase32);

    return { secret: secretBase32 };
  }

  // validate the 2fa secret with provided token
  async validate2FAToken(
    userId: number,
    token: string,
  ): Promise<{ verified: boolean }> {
    try {
      // Find the user on the based on id
      const user = await this.userService.findById(userId);

      // Add null check for user
      if (!user) {
        throw new Error('User not found');
      }

      // extract his 2FA secret
      // verify the secret with a token by calling the speakeasy verify method
      const verified = speakeasy.totp.verify({
        secret: user.twoFASecret,
        token: token,
        encoding: 'base32',
      });

      // if validated then sends the json web token in the response
      if (verified) {
        return { verified: true };
      } else {
        return { verified: false };
      }
    } catch {
      throw new UnauthorizedException('Error verifying token');
    }
  }

  async disable2FA(userId: number): Promise<UpdateResult> {
    return this.userService.disable2FA(userId);
  }
}
