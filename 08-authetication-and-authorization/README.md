# Authentication and Authorization

## User Registration

Save the user in the database after account creation in the application. In a Nest.js environment, you'll often use a service with injected repository to handle this data-persistence layer. This follows the software engineering principle of separation of concerns, keeping the data storage logic distinct from the business logic.

### Install Dependencies

Save the user password in an encrypted format. Utilize the `bcryptjs` package for password encryption within the Nest.js ecosystem. While it's generally advisable to also use a salt for added security, this project will focus solely on encryption. Install this dependency to proceed. Encrypting user passwords is crucial for data security and aligns with the software engineering principle of confidentiality. The choice of `bcryptjs` is notable for its reliable and secure encryption algorithm.

```bash
pnpm i bcryptjs
```

### Create User and Auth Module

`app.module.ts`

```tsx
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    SongsModule,
    PlayListModule,
    UsersModule,
    AuthModule,
  ],
})
```

Create two new modules with nest cli.

`auth.module.ts`

```tsx
import { Module } from '@nestjs/common';

import { AuthController } from '@/modules/auth/auth.controller';
import { AuthService } from '@/modules/auth/auth.service';
import { UsersModule } from '@/modules/users/users.module';

@Module({
  imports: [UsersModule],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
```

We are exporting the `AuthService` from `AuthModule` which means when we import the `AuthModule` into another module you can use the `AuthService` or inject the `authservice` into your imported module. If you don't have an `AuthService` you can create it using `nest-cli` We are also importing the `UsersModule` here because we need `UserService` here.

`users.module.ts`

```tsx
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from './user.entity';
import { UsersService } from './users.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
```

### Creating `AuthController`

```tsx
import { Body, Controller, Post } from '@nestjs/common';

import { CreateUserDTO } from '@/modules/users/dto/create-user.dto';
import { User } from '@/modules/users/user.entity';
import { UsersService } from '@/modules/users/users.service';

@Controller('auth')
export class AuthController {
  constructor(private userService: UsersService) {}
  @Post('register')
  signup(
    @Body()
    createUserDTO: CreateUserDTO,
  ): Promise<User> {
    return this.userService.create(createUserDTO);
  }
}
```

We have created a new route for signup to handle the signup request. We did not create a `CreateUserDTO` and create method inside the `UsersService`

### Creating `UsersService`

```tsx
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import bcrypt from 'bcryptjs';
import { instanceToPlain } from 'class-transformer';
import { Repository } from 'typeorm';

import { CreateUserDTO } from './dto/create-user.dto';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}
  async create(createUserDTO: CreateUserDTO): Promise<User> {
    const salt = await bcrypt.genSalt();
    createUserDTO.password = await bcrypt.hash(createUserDTO.password, salt);
    const savedUser = await this.userRepository.save(createUserDTO);

    // instanceToPlain will automatically exclude @Exclude decorated fields
    return instanceToPlain(savedUser) as User;
  }
}
```

1. We have imported the User Entity imports: `[TypeOrmModule.forFeature([User])]`, in
   the `UsersModule` now we can inject the `UsersRepository` inside the `UsersService`.
2. We have created the salt number to encrypt the password
3. We have encrypted the password and set it to `userDTO` password property
4. You have to save the user by calling the save method from the repository
5. You don't need to send the user password in the response. You have to delete the user
   password from the user object
6. Finally we need to return the user in the response

### Create `CreateUserDTO`

```tsx
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDTO {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
```

### Refactor the User Entity

Import `Exclude` from `class-transformer` package.

```tsx
@Entity('users')
export class User {
  @Column()
  @Exclude()
  password: string;
}
```

When working with `TypeORM`, there might be cases where you want to exclude one or multiple columns (fields) from being selected. I don't want to send the password in the response that is why I have added Exclude.

### Test the Application

`POST` <http://localhost:3000/auth/register>

```tsx
{
  "firstName": "john",
  "lastName": "doe",
  "email": "john@gmail.com",
  "password": "123456"
}
```

## User Login

### What is JSON Web Token Authentication

JSON Web Token (`JWT`) authentication is a method of securely transmitting information between parties as a JSON object. It is commonly used for authentication and authorization purposes in web applications and APIs. The flow of JWT authentication involves the following steps:

**User Authentication:** The user provides their credentials (e.g., username and password) to the authentication server. The server verifies the credentials and generates a JWT if they are valid.

**JWT Generation:** Upon successful authentication, the authentication server creates a JWT
containing three parts: header, payload, and signature.

**Header:** It typically consists of two parts: the token type, which is JWT, and the hashing algorithm used to create the signature. Payload: This contains the claims or statements about the user, such as their username, role, and any additional information. The payload is not encrypted but is `Base64Url` encoded. Signature: The signature is created by combining the encoded header, encoded payload, and a secret key known only to the server. It ensures the integrity of the token and prevents tampering. JWT Issuance: The server responds to the user's authentication request by sending the `JWT` back as a response.

**Token Storage:** The client (usually a web browser or a mobile app) stores the received JWT securely. It can be stored in various places, such as local storage, cookies, or session storage, depending on the application's requirements.

**Token Usage:** For subsequent requests to protected resources, the client includes the JWT in the request headers, typically as the "Authorization" header with the "Bearer" scheme, followed by the JWT.

**Token Verification:** When the server receives a request with a JWT, it extracts the token from the header, payload, and signature.

**Signature Validation:** The server recalculates the signature using the same algorithm and the secret key. If the recalculated signature matches the signature in the token, it ensures the token's integrity.

**Expiration Check:** The server checks the expiration time (`exp`) claim in the payload to ensure the token has not expired. If it has expired, the server rejects the request. Additional Validations: The server may perform additional checks based on the application's requirements, such as verifying the token's audience (`aud`) or checking for revoked tokens. Access Grant: If the token passes all the validations, the server grants access to the requested resource or performs the requested action on behalf of the user.

**Token Renewal:** If the token has an expiration time, the client can request a new JWT before the current one expires. This process is typically done using a refresh token or by re-authenticating the user.

The JWT authentication flow allows the client to include a token with each request, eliminating the need for server-side session storage. It enables stateless authentication, making it suitable for distributed systems and APIs.

### Install Dependencies authentication middleware

```bash
pnpm i @nestjs/passport passport
```

`@nestjs/passport` is an official `NestJS` module that provides integration with Passport.js, a popular authentication middleware for Node.js. It simplifies the process of implementing various authentication strategies within a `NestJS` application.

### Create Login Route and Handler

```tsx
import { Body, Controller, Post } from '@nestjs/common';

import { AuthService } from './auth.service';
import { LoginDTO } from './dto/login.dto';

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
}
```

We have to create a new login route in `AuthService`. We have called the login method from `Authservice`. We have not created the login method in `AuthService` yet, let's create the login method

```tsx
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
```

1. Wehaveto find the user based on email. We need to get the email and password from the request body.
2. Wewill compare the user password with an encrypted password that we saved in the last video
3. If the password matches then delete the user password and send the user back in the response. It means the user has logged in successfully
4. If the password does not match we have to send the error back in the response

### Create `LoginDTO`

You have to create the `LoginDTO` file inside the `auth/dto/login.dto.ts`

```tsx
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDTO {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
```

### Create `findOne` method inside `UsersService`

```tsx
  async findOne(data: Partial<User>): Promise<User> {
    const user = await this.userRepository.findOneBy({ email: data.email });
    if (!user) {
      throw new UnauthorizedException('Could not find user');
    }
    return user;
  }
```

### Test the Application for login user

`POST` <http://localhost:3000/auth/login>

```tsx
{
  "email": "john@gmail.com",
  "password": "123456"
}
```

We did not send the JSON web token back in the response. In the next lesson, I will teach you how to send the `JSON` web token in the response when the user has successfully logged in

## Authenticate User

Find the user from the database based on their email and encrypt their password. If the user logs in successfully, generate a JSON Web Token (JWT) and include it in the response. This is a key step in stateless authentication, a software engineering principle that improves scalability and security. In the previous lesson, the generation and inclusion of the JWT in the response were omitted, which left the authentication process incomplete.

### Install Dependencies

```bash
pnpm i @nestjs/jwt passport-jwt

```

We have to install these packages to implement complete JSON Web Token authentication and Authorization.

### Import JWT Module in `AuthModule`

`auth.module.ts`

```tsx
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { AuthController } from '@/modules/auth/auth.controller';
import { AuthService } from '@/modules/auth/auth.service';
import { UsersModule } from '@/modules/users/users.module';

@Module({
  imports: [UsersModule, JwtModule.register({ secret: 'JWT_SECRET' })],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
```

### `OR` JWT secret configuration

Based on your document, here's how to add JWT secret configuration to your existing setup:

#### 1. Update Environment Validation (`env.validation.ts`)

```tsx
import { z } from 'zod';

const environmentSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  PORT: z
    .string()
    .default('3000')
    .transform(Number)
    .pipe(z.number().min(1000).max(65535)),
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']).default('info'),

  // JWT Configuration
  JWT_SECRET: z.string().min(32, 'JWT secret must be at least 32 characters'),
  JWT_EXPIRES_IN: z.string().default('1h'),
  JWT_REFRESH_SECRET: z.string().optional(),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),
});

export type EnvironmentVariables = z.infer<typeof environmentSchema>;

export function validateEnvironment(config: Record<string, unknown>) {
  const result = environmentSchema.safeParse(config);

  if (!result.success) {
    const errors = result.error.issues
      .map((err) => `${err.path.join('.')}: ${err.message}`)
      .join('\n');

    throw new Error(`Environment validation failed:\n${errors}`);
  }

  return result.data;
}
```

#### 2. Add JWT Configuration (`configuration.ts`)

```tsx
import { registerAs } from '@nestjs/config';

export const appConfig = registerAs('app', (): AppConfiguration => {
  const env = process.env.NODE_ENV as 'development' | 'production' | 'test';

  // Helper function to get JWT configuration
  const getJwtConfig = (): JwtConfig => ({
    secret: process.env.JWT_SECRET!,
    expiresIn: process.env.JWT_EXPIRES_IN || '1h',
    refreshSecret: process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET!,
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  });

  return {
    // Existing basic configuration
    env,
    port: parseInt(`${process.env.PORT}`, 10) || 3000,
    isDevelopment: env === 'development',
    isProduction: env === 'production',
    isTest: env === 'test',
    logLevel: (process.env.LOG_LEVEL as LogLevel) || 'info',

    // JWT configuration
    jwt: getJwtConfig(),
  };
});

// Updated type definitions
export type LogLevel = 'error' | 'warn' | 'info' | 'debug';

export interface JwtConfig {
  secret: string;
  expiresIn: string;
  refreshSecret: string;
  refreshExpiresIn: string;
}

export interface AppConfiguration {
  // Basic configuration
  env: 'development' | 'production' | 'test';
  port: number;
  isDevelopment: boolean;
  isProduction: boolean;
  isTest: boolean;
  logLevel: LogLevel;

  // JWT configuration
  jwt: JwtConfig;
}
```

#### 3. Update Typed Configuration Service (`config.service.ts`)

```tsx
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { AppConfiguration, JwtConfig, LogLevel } from './configuration';

@Injectable()
export class TypedConfigService {
  constructor(private configService: ConfigService) {}

  get app(): AppConfiguration {
    return this.configService.get<AppConfiguration>('app')!;
  }

  get jwt(): JwtConfig {
    return this.app.jwt;
  }

  get logLevel(): LogLevel {
    return this.app.logLevel;
  }

  // Environment utility methods
  isDevelopment(): boolean {
    return this.app.isDevelopment;
  }

  isProduction(): boolean {
    return this.app.isProduction;
  }

  isTest(): boolean {
    return this.app.isTest;
  }

  getPort(): number {
    return this.app.port;
  }

  // JWT utility methods
  getJwtSecret(): string {
    return this.jwt.secret;
  }

  getJwtExpiresIn(): string {
    return this.jwt.expiresIn;
  }

  getJwtRefreshSecret(): string {
    return this.jwt.refreshSecret;
  }

  getJwtRefreshExpiresIn(): string {
    return this.jwt.refreshExpiresIn;
  }

  // Logging utility methods
  shouldLog(level: LogLevel): boolean {
    const levels: Record<LogLevel, number> = {
      error: 0,
      warn: 1,
      info: 2,
      debug: 3,
    };

    const currentLevel = levels[this.logLevel];
    const targetLevel = levels[level];

    return targetLevel <= currentLevel;
  }
}
```

#### 4. Update Auth Module (`auth.module.ts`)

```tsx
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { TypedConfigService } from '@/common/config/config.service';
import { AuthController } from '@/modules/auth/auth.controller';
import { AuthService } from '@/modules/auth/auth.service';
import { UsersModule } from '@/modules/users/users.module';

@Module({
  imports: [
    UsersModule,
    // JwtModule.registerAsync({
    //   inject: [TypedConfigService],
    //   useFactory: (configService: TypedConfigService) => ({
    //     secret: configService.jwt.secret,
    //     signOptions: {
    //       expiresIn: configService.jwt.expiresIn,
    //     },
    //   }),
    // }),
    JwtModule.registerAsync({
      inject: [TypedConfigService],
      useFactory: (configService: TypedConfigService) => ({
        secret: configService.getJwtSecret(),
        signOptions: {
          expiresIn: configService.getJwtExpiresIn(),
        },
      }),
    }),
  ],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
```

#### 5. Update Environment Files

##### `.env`

```text
# Application Environment
NODE_ENV=development

# Server Configuration
PORT=3000

# Logging Configuration
LOG_LEVEL=info

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-at-least-32-characters-long
JWT_EXPIRES_IN=1h
JWT_REFRESH_SECRET=your-refresh-token-secret-key-32-chars
JWT_REFRESH_EXPIRES_IN=7d
```

#### 🔒 Security Notes

1. **JWT Secret**: Must be at least 32 characters long and cryptographically secure
2. **Environment-specific secrets**: Use different secrets for different environments
3. **Production secret**: Should be generated using a secure random generator
4. **Never commit secrets**: Ensure `.env*` files are in `.gitignore`

#### Generate Secure JWT Secret

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

This setup gives you type-safe, validated JWT configuration that integrates seamlessly with your existing environment management system.

You need to register the `JwtModule` module in the `AuthModule` by providing the unique secret key. We will use this secret key to decode the token or validate the token

### Refactor the `AuthService`

`auth.service.ts`

```tsx
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

import { LoginDTO } from './dto/login.dto';

import { UsersService } from '@/modules/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(loginDTO: LoginDTO): Promise<{ accessToken: string }> {
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

    const payload = { email: user.email, sub: user.id };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
```

1. Inject `JwtService` as a dependency.
2. If the password matches, generate the JWT token using the `jwtService.sign` method.
3. Provide the payload, which should include the user email and `userId` inside the `JWT token`. Choose a name for the user ID field; 'sub' is used here but any name can be applied.

### Create JWT Strategy Service

`jwt.strategy.ts`

```tsx
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
```

Create the `JWTStrategy` service, extending it with `PassportStrategy`. When applying
`@AuthGuard('jwt')`, the validate function will be called, automatically adding the `userId`
and `email` to the `req.user` object.

### Register the `JWTStrategy` in `AuthModule`

`auth.module.ts`

```tsx
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import { TypedConfigService } from '@/common/config/config.service';
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
  ],
  providers: [AuthService, JWTStrategy, TypedConfigService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
```

You have to register the `JWTStrategy` as a provider in `AuthModule`. You also have to register the `PassportModule`. It will allow us to use the `PassportStrategy` class.

### Create JWT Guard

A Guard is like a middleware in express.js. You can implement role-based authentication using guards

`jwt.guard.ts`

```tsx
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
```

Let's create a provider which is `JwtAuthGuard`. You have to apply the `JWTAuthGuard` to protect a private route

### Protect Private Route in `AppController`

```tsx
import { Controller, Get, Request, UseGuards } from '@nestjs/common';

import { AppService } from '@/app.service';
import { JwtAuthGuard } from '@/modules/auth/jwt.guard';

interface AuthenticatedUser {
  userId: string;
  email: string;
}

interface AuthenticatedRequest extends Request {
  user: AuthenticatedUser;
}

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  getProfile(@Request() req: AuthenticatedRequest): AuthenticatedUser {
    return req.user;
  }
}
```

Create a new protected route inside the `AppController`. When sending a request to access the profile, the response will include the user ID and email. Apply `JwtAuthGuard` to any route in any controller to secure the endpoint.

### Test the Application

```bash
GET <http://localhost:3000/profile>

Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImhhaWRlcl9hbGkzQGdtYWlsLmNvbSIsInN1YiI6NywiaWF0IjoxNjg0MjM3ODgzLCJleHAiOjE2ODQzMjQyODN9.DztMDAKZOnQjZPFkFPiWiJUmI_VnrNfNvfwPI0yJ8MA

```

First, send a login request to obtain the token, and then provide that token in the header.

## RBAC Authentication

### What is role-base access control

Role-based authentication is a method of access control that regulates user permissions and privileges within a system based on their assigned roles. In this approach, users are categorized into roles based on their job responsibilities, functions, or levels of authority within an organization.

Each role is associated with a set of permissions that determine what actions and resources a user with that role can access. These permissions can include read, write, modify, delete, and other operations on various system resources such as files, databases, or functionalities.

### We are going to implement this scenario

- An artist can `upload/create` the song.

We have to restrict the access of creating songs endpoint. Only artists can access this endpoint and create a song

### Create an Artists Module

```tsx
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Artist } from './artist.entity';
import { ArtistsController } from './artists.controller';
import { ArtistsService } from './artists.service';

@Module({
  imports: [TypeOrmModule.forFeature([Artist])],
  providers: [ArtistsService],
  controllers: [ArtistsController],
  exports: [ArtistsService],
})
export class ArtistsModule {}
```

### Import `ArtistsModule`

#### into `AppModule`

```tsx
 @Module({
  imports: [
    SongsModule,
   PlayListModule,
   UsersModule,
   AuthModule,
   ArtistsModule,
  ],
})
```

#### into `AuthModule`

```tsx
 @Module({
  imports: [
    ...
   ArtistsModule,
  ],
})
```

### Create `ArtistsService`

```tsx
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Artist } from './artist.entity';

@Injectable()
export class ArtistsService {
  constructor(
    @InjectRepository(Artist)
    private artistRepo: Repository<Artist>,
  ) {}

  findArtist(userId: number): Promise<Artist | null> {
    return this.artistRepo.findOneBy({ user: { id: userId } });
  }
}
```

We will use the `findArtist` method to check if the current logged in user is an artist or not.

### Refactor login method in `AuthService`

```tsx
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

import { JwtPayload } from './auth.type';
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

  async login(loginDTO: LoginDTO): Promise<{ accessToken: string }> {
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

    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
```

1. Refactor the payload method in the login function by changing `sub: user.id` to `userId:
user.id`.
2. Find the artist based on the logged-in user.
3. If the user is an artist, save the artist ID in the payload; this artist ID will be used when decoding the token in the `ArtistGuard`.

### Create a new `JwtArtistGuard`

In Nest.js, implementing role-based authentication involves the use of guard functions, which act as middleware to authorize requests. Each role can be associated with a distinct guard function that validates whether a user has the appropriate permissions to access a resource. This is an application of the "Single Responsibility Principle," as each guard function focuses solely on authorizing a specific role, making the code easier to manage and extend.

`auth/jwt-artist.guard.ts`

```tsx
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
```

1. When you apply the `JwtAuthGuard` at the controller function it will call the `handleRequest` function
2. If there is an error or no user then it will send the unauthorized error
3. Here we are checking the user role, if it is an artist then we have to return the user. This user will have have `email`, `userId`, and `artistId` property

### Refactor the validate method in `JwtStrategy`

```tsx
  validate(payload: JwtPayload) {
    return {
      userId: payload.userId,
      email: payload.email,
      artistId: payload.artistId,
    };
  }
```

1. Add the `payloadType` for the argument.
2. Include `artistId` in the response; note that `artistId` is an optional property and may be null.

### Apply `JwtArtistGuard` on creating songs endpoint

`songs.controller.ts`

```tsx
  @Post()
  @UseGuards(JwtArtistGuard)
  create(@Body() createSongDTO: CreateSongDTO, @Request() req): Promise<Song> {
    console.log(req.user);
    return this.songsService.create(createSongDTO);
  }
```

Now we have protected this endpoint, only artist can access this endpoint and create a new song

### Test the Application

1. First of all you must have an artist record in your DB
2. If you don't have you can create an artist manually using pgAdmin
3. You have to send the login request as an artist
4. It will give you the access token you have to use that token to access to Create Songs endpoint

#### Artist Login User

```tsx
POST http://localhost:3001/auth/login

{
  "email": "john_doe@gmail.com",
  "password": "123456"
}
```

It will give you the token, you have to use that token to create a new song

#### Create New SONGS REQUEST as An Artist

```tsx
POST http://localhost:3001/songs
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImhhaWRlcl9hbGkzQGdtYWlsLmNvbSIsInVzZXJJZCI6NywiaWF0IjoxNjg0MzA3Mjg3LCJleHAiOjE2ODQzOTM2ODd9.A9SEhTH0O0SR5-UELhMhak5MVIyY2ISRwR-o2RKF_dY

{
 "title": "You for me",
 "artists": [1],
 "releasedDate" : "2022-08-29",
 "duration" :"02:34",
 "lyrics": "by, you're my adrenaline. Brought out this other side of me You don't even know Controlling my whole anatomy, oh Fingers are holding you right at the edge You're slipping out of my hands Keeping my secrets all up in my head I'm scared that you won't want me back, oh I dance to every song like it's about ya I drink 'til I kiss someone who looks like ya I wish that I was honest when I had you I shoulda told you that I wanted you for me I dance to every song like it's about ya I drink 'til I kiss someone who looks like ya"
}
```

## Two Factor Authentication

### What is Two Factor Authentication

Two-factor authentication (2FA), also known as multi-factor authentication (MFA), is a security mechanism that requires users to provide two or more separate forms of identification to verify their identity and gain access to a system or account. It adds an extra layer of security beyond traditional username and password authentication.

The two factors typically fall into three categories:

Something you know: This factor involves knowledge-based information that the user possesses, such as a password, PIN, or answers to security questions.

1. Something you have: This factor requires the user to possess a physical device or object, such as a smartphone, hardware token, or smart card. This device generates or receives a unique one-time code or a cryptographic key.
2. Something you are: This factor refers to biometric characteristics unique to the individual, such as fingerprints, facial recognition, iris scans, or voice recognition.
3. The combination of these factors increases the security of authentication because an attacker would need to compromise multiple elements to gain unauthorized access. Even if one factor is compromised, the additional factor(s) provide an extra layer of protection.

Here's a simplified example of how two-factor authentication works:

1. The user enters their username and password on a login page.
2. After successful initial authentication, the system prompts the user for a second form of verification.
3. The user may be required to provide a one-time code generated by an authentication app on their smartphone or received via SMS.
4. The user enters the one-time code to complete the authentication process.
5. If both factors are verified successfully, access is granted to the user.

Two-factor authentication is widely used across various systems, including online accounts (email, social media, banking), VPNs, cloud services, and more. It significantly reduces the risk of unauthorized access due to compromised passwords or stolen credentials, enhancing overall security and protecting sensitive information.

### Use base32 secret key in QR code App

You have to install the `chrome extension` or Google authenticator `app` on your phone

You have received the secret key now you have to create a new app in your QR code application. It will ask you to add a manual secret key and the name of your app

### Install Dependencies

Speakeasy is a one-time passcode generator, ideal for use in two-factor authentication, that supports Google Authenticator and other two-factor devices. It is well-tested and includes robust support for custom token lengths, authentication windows, hash algorithms like SHA256 and SHA512, and other features, and includes helpers like a secret key generator.

Speakeasy implements one-time passcode generators as standardized by the Initiative for Open Authentication (OATH). The HMAC-Based One-Time Password (HOTP) algorithm defined in RFC 4226 and the Time-Based One-time Password (TOTP) algorithm defined in RFC 6238 are supported. This project incorporates code from passcode, originally a fork of `Speakeasy`, and `notp`.

```bash
pnpm i speakeasy
```

### Update User Entity

```tsx
  @Column({ nullable: true, type: 'text' })
  twoFASecret: string;

  @Column({ default: false, type: 'boolean' })
  enable2FA: boolean;
```

You have to add two new columns for two-factor authentication. The first column will be used to store the secret key for each user. The second column will be used to enable or disable the two-factor authentication.

### Add new Enable2FA type

`auth/auth.type.ts`

```tsx
export type Enable2FAType = {
  secret: string;
};
```

### Enable 2-Factor Authentication

#### Refactor `AuthService`

```tsx
import * as speakeasy from 'speakeasy';

  async enable2FA(userId: number): Promise<Enable2FAType> {
    const user = await this.userService.findById({ id: userId });
    if (user.enable2FA) {
      return { secret: user.twoFASecret };
    }

    const secret = speakeasy.generateSecret();
    console.log(secret);
    user.twoFASecret = secret.base32;
    await this.userService.updateSecretKey(user.id, user.twoFASecret);

    return { secret: user.twoFASecret };
  }
```

1. You have to create a new method to find the user on the based on user id
2. If user has already enabled the 2 factor authentication we have to return the secret key.
3. If the user did not enable the 2-factor authentication then we have to generate the secret key. This `speakeasy.generateSecret()` will return an object with `secret.ascii`, `secret.hex`, and `secret.base32`.
4. We are going to use the `base32` secret key
5. Finally, we have to update the `twoFAsecret` key for the specific user
6. You have to return the secret key in the response.

#### Refactor `UsersService`

```tsx
  async findById(id: number): Promise<User | null> {
    return this.userRepository.findOneBy({ id: id });
  }

  async updateSecretKey(userId, secret: string): Promise<UpdateResult> {
    return this.userRepository.update(
      { id: userId },
      {
        twoFASecret: secret,
        enable2FA: true,
      },
    );
  }
```

You have to the secret key and enable the 2-factor authentication for a user

#### Refactor `AuthService`

```tsx
  async enable2FA(userId: number): Promise<Enable2FAType> {
    // Find the user on the based on id
    const user = await this.userService.findById(userId);

    // Add null check for user
    if (!user) {
      throw new Error('User not found');
    }

    if (user.enable2FA) {
      return { secret: user.twoFASecret };
    }

    const secret = speakeasy.generateSecret();
    console.log(secret);
    user.twoFASecret = secret.base32;
    await this.userService.updateSecretKey(user.id, user.twoFASecret);

    return { secret: user.twoFASecret };
  }
```

#### Create Endpoint in `AuthController` to enable 2FA

```tsx
  @Get('enable-2fa')
  @UseGuards(JwtAuthGuard)
  enable2FA(
    @Request()
    req,
  ): Promise<Enable2FAType> {
    console.log(req.user);
    return this.authService.enable2FA(+req.user.userId);
  }
```

#### Test the Enable Authentication Endpoint

```json
POST http://localhost:3000/auth/enable-2fa

Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImhhaWRlcl9hbGkzQGdtYWlsLmNvbSIsInN1YiI6NywiaWF0IjoxNjg0NDEyMjk2LCJleHAiOjE2ODQ0OTg2OTZ9.Fg0K4gJABBP3nqt8PMK72MzSnFVK0xRaEeC_aDxnfeo
```

### Verify One-time password/token

`auth.controller.ts`

```tsx
  @Post('validate-2fa')
  @UseGuards(JwtAuthGuard)
  validate2FA(
    @Request()
    req,
    @Body()
    ValidateTokenDTO: ValidateTokenDTO,
  ): Promise<{ verified: boolean }> {
    return this.authService.validate2FAToken(
      +req.user.userId,
      ValidateTokenDTO.token,
    );
  }
```

You have to create an endpoint to validate the one-time `password/token`

`auth/dto/validate-token.dto.ts`

```tsx
import { IsNotEmpty, IsString } from 'class-validator';

export class ValidateTokenDTO {
  @IsNotEmpty()
  @IsString()
  token: string;
}
```

Now you have to create a new method inside the `auth.service.ts` to verify the token

```tsx
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
```

Let's test the validate token endpoint.

#### Test Validate 2FA Token

```json
POST http://localhost:3000/auth/validate-2fa

Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InNhbUBnbWFpbC5jb20iLCJzdWIiOjksImlhdCI6MTY4NDQ5ODg0MSwiZXhwIjoxNjg0NTg1MjQxfQ.dKgmLSsGctbWR9HKz3ByfS2ZpUGiNR234u qEgs0pgtQ

{
  "token": "054603"
}
```

The token I have provided is one-time password/token from the authenticator app. You have to provide your unique token from your authenticator app

### Disable 2-Factor Authentication

You have to new method inside the `auth.service.ts` to disable the authentication

`auth.service.ts`

```tsx
async disable2FA(userId: number): Promise<UpdateResult> {
  return this.userService.disable2FA(userId);
}
```

`users.service.ts`

```tsx
  async disable2FA(userId: number): Promise<UpdateResult> {
    return this.userRepository.update(
      { id: userId },
      {
        enable2FA: false,
        twoFASecret: null,
      },
    );
  }
```

You have to create a new route to disable authentication

`auth.controller.ts`

```tsx
  @Get('disable-2fa')
  @UseGuards(JwtAuthGuard)
  disable2FA(
    @Request()
    req,
  ): Promise<UpdateResult> {
    return this.authService.disable2FA(+req.user.userId);
  }
```

#### Test the disabled authentication endpoint

```bash
GET http://localhost:3000/auth/disable-2fa

Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImhhaWRlcl9hbGkzQGdtYWlsLmNvbSIsInN1YiI6NywiaWF0IjoxNjg0NDkyOTk1LCJleHAiOjE2ODQ1NzkzOTV9.vhAHpdyuQHWvsET2sSLvQpr33vpk8K089NLiENgh7pM
```

### If user enabled the 2FA refactor the login method

The token I have provided is one-time password/token from the authenticator app. You have to provide your unique token from your authenticator app

`auth.service.ts`

```tsx
  async login(
    loginDTO: LoginDTO,
  ): Promise<
    { accessToken: string } | { validate2FA: string; message: string }
  > {
   // existing code...

   // new code...
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
```

You have to refactor the return type. If the user has enabled the 2FA it will use the second return type with a custom message

1. You have to add a new code here to check user enabled the 2FA.
2. If the user enabled the 2FA then we have to send the link to validate the token from your QR code app
