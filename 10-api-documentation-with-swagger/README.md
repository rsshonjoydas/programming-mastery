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
