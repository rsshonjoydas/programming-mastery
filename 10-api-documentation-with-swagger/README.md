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
