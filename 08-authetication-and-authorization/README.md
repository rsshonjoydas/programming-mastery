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
