# API Documentation with Swagger

## What is Swagger?

The components of Swagger include:

1. **Swagger Specification:** This forms the blueprint of the API, documenting its structure in a format that can be both human and machine interpreted. `NestJS` supports Swagger by offering packages such as `@nestjs/swagger` to auto-generate specifications from code, which aligns with best practices by ensuring that the documentation remains synchronized with the codebase.
2. **Swagger Editor:** This browser-based editor allows for the crafting and fine-tuning of Swagger specifications. `NestJS` users can import their auto-generated Swagger configuration into the Swagger Editor to make further refinements or visualize changes, streamlining API design iterations.
3. **Swagger UI:** Interactive documentation created by Swagger UI facilitates clear communication and understanding of API functionalities. `NestJS` leverages Swagger UI to enable developers and API consumers to interact with the API endpoints directly from the browser, encouraging a hands-on approach to exploring API capabilities.
4. **Swagger `Codegen`:** This tool provides the means to scaffold server structures and client-side code from the API specifications. Within the `NestJS` framework, Swagger `Codegen` can expedite development by auto-creating API-related code, thus embodying a best practice of reducing manual coding and potential human error.

Employing Swagger within `NestJS` promotes a systematic, well-documented, and collaborative API
development process, reflecting best practices and serving as a foundation for robust software
architecture.

## Setup Swagger

### Step 1: Install Dependencies

```bash
pnpm i @nestjs/swagger
```

The Nest.js built-in package will be utilized to implement API documentation with Swagger. This integration facilitates the automatic generation of interactive API documentation, which is a best practice for maintaining clear and structured endpoint documentation for developers and users alike.

### Step 2: Configure `SwaggerModule` in bootstrap function

`SwaggerModule` configuration takes place within the bootstrap function. This NestJS-specific module automatically generates interactive API documentation, and as a best practice, it's advised to configure Swagger in development environments to aid in API design and testing without compromising the production environment's security.

```tsx
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  app.useGlobalPipes(new ValidationPipe());
  //Configure the swagger module here
  const config = new DocumentBuilder()
    .setTitle('Spotify Clone')
    .setDescription('The Spotify Clone Api documentation')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
}
```

1. The `DocumentBuilder` is utilized to configure the title, description, and version of the API documentation.
2. This document is then created with the help of the `SwaggerModule`, which is specific to `NestJS` for API design and testing.
3. Subsequently, the Swagger document is hosted at the `/api` endpoint, making it accessible via <http://localhost:3000/api>, offering a visual interface for interacting with the API. As a best practice, maintaining up-to-date and comprehensive Swagger documentation ensures that APIs are understandable and usable, aiding in both development and API consumption.

## Configure Routes

### Step 1: Add auth Tags in the Auth Controller (Optional)

In the initial step, authentication tags are added to the Auth Controller. This labeling within `NestJS` facilitates Swagger documentation generation, which helps to categorically group and distinguish authentication endpoints. It is considered a best practice to annotate controllers with appropriate Swagger tags to enhance API documentation and maintain clarity for developers interfacing with the backend services.

```tsx
@ApiTags('auth')
export class AuthController {}
```

Now you will see all the auth routes in the auth section

### Step 2: Add API Operation and Response for the Signup flow

In Step 2, `ApiOperation` and `ApiResponse` annotations are added for the signup process. These annotations, part of the Swagger module in `NestJS`, facilitate API documentation by describing the operation and its possible responses, enhancing understandability for developers and end-users alike. It is considered good practice to thoroughly document API endpoints with such annotations, as this can significantly improve the development experience and future maintenance.

```tsx
 @ApiOperation({ summary: 'Register new user' })
 @ApiResponse({
   status: 201,
   description: 'It will return the user in the response',
 })
 signup(){}
```

The `@ApiOperation` decorator instructs Swagger to generate documentation for a particular endpoint, enriching the API's interactive exploration interface. Meanwhile, `@ApiResponse` defines the expected response for an endpoint, including the status code, which improves clarity and client-side handling expectations. `NestJS`'s integration with Swagger simplifies API documentation and it's
considered best practice to use these decorators to provide clear, self-documenting API endpoints that align with `OpenAPI` specifications.

## Show User Schema

### Step 1: Add `@ApiProperty` in the User Entity

In the User Entity, the `@ApiProperty` decorator is added to enhance Swagger documentation automatically. This inclusion is a NestJS-specific feature that aids in generating interactive API documentation, and it exemplifies the practice of incorporating documentation as a part of the coding process to maintain clarity and up-to-date API information for developers.

```tsx
import { ApiProperty } from '@nestjs/swagger';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: 'John',
    description: 'Provide the first name of the user',
  })
  @Column()
  firstName: string;

  @ApiProperty({
    example: 'Doe',
    description: 'provide the lastName of the user',
  })
  @Column()
  lastName: string;

  @ApiProperty({
    example: 'john_doe@gmail.com',
    description: 'Provide the email of the user',
  })
  @Column({ unique: true })
  email: string;

  @ApiProperty({
    example: 'test123#@',
    description: 'Provide the password of the user',
  })
  @Column()
  @Exclude()
  password: string;

  /**
   * A user can create many playLists
   */
  @OneToMany(() => Playlist, (playList) => playList.user)
  playLists: Playlist[];

  @Column({ nullable: true, type: 'text' })
  twoFASecret: string | null;

  @Column({ default: false, type: 'boolean' })
  enable2FA: boolean;

  @Column()
  apiKey: string;
}
```

The `@ApiProperty` decorator enhances swagger documentation by explicitly declaring the user schema. Utilizing this decorator is considered a best practice within NestJS for API documentation, as it provides clear and interactive API endpoints for testing and inspection.

### Step 2: Register the Swagger plugin in `nest-cli.json`

To register the Swagger plugin, it is specified in the `nest-cli.json` file. This NestJS-specific step integrates Swagger automatically, generating API documentation and providing interactive testing utilities. Employing this plugin is a recommended practice as it promotes standardized API documentation and simplifies developer onboarding and frontend integration efforts.

```json
{
  "$schema": "https://json.schemastore.org/nest-cli",
  "collection": "@nestjs/schematics",
  "sourceRoot": "src",
  "compilerOptions": {
    "deleteOutDir": true,
    "plugins": [
      {
        "name": "@nestjs/swagger",
        "options": {
          "introspectComments": true
        }
      }
    ]
  }
}
```

The plugin array must be created, followed by the registration of the `@nestjs/swagger` package as a plugin. This step is crucial for enabling Swagger documentation in a `NestJS` application, a best practice for automatically generating interactive API documentation that enhances developer experience and API usability.

## User Authentication

### Step 1: Add API Operation for Login

The addition of an API operation for login is achieved through creating an authentication controller with a dedicated login route. Implementing this within `NestJS` typically involves using Guards and Strategies, leveraging Passport.js under the hood for a robust and secure authentication process. As a best practice, it is advisable to use environment variables for sensitive information such as secret keys and to apply validation pipelines to ensure the integrity of user input before processing authentication.

`auth.controller.ts`

```tsx
  @Post('login')
  @ApiOperation({ summary: 'Login user' })
  @ApiResponse({
    status: 200,
    description: 'It will give you the access_token in the response',
  })
  login()
```

### Step 2: Enable Bearer Auth

`main.ts`

```tsx
app.useGlobalPipes(new ValidationPipe());
//Configure the swagger module here
const config = new DocumentBuilder()
  .setTitle('Spotify Clone')
  .setDescription('The Spotify Clone Api documentation')
  .setVersion('1.0')
  // Enable Bearer Auth here
  .addBasicAuth(
    {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      name: 'JWT',
      description: 'Enter JWT token',
      in: 'header',
    },
    'JWT-auth', // We will use this Bearer Auth with the JWT-auth name on the
  )
  .build();

const document = SwaggerModule.createDocument(app, config);
SwaggerModule.setup('api', app, document);
```

### Step 3: Apply `ApiBearerAuth` on the protected Route

`app.controller.ts`

```tsx
  @Get('profile')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  getProfile(@Request() req: AuthenticatedRequest): AuthenticatedUser {
    return req.user;
  }
```

The `@ApiBearerAuth` decorator has been applied to `getProfile` within `AppController`, designating it as a protected route that returns the user profile in the response. In `NestJS`, securing routes with decorators aligns with the framework's philosophy of declarative programming, enhancing readability and security- a practice in line with advanced software design principles.
