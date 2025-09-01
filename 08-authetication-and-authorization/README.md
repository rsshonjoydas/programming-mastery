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
