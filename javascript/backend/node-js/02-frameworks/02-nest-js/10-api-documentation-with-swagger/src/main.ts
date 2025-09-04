import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from '@/app.module';
import { TypedConfigService } from '@/common/config/config.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Get typed config service
  const configService = app.get(TypedConfigService);

  // Global validation pipe
  app.useGlobalPipes(new ValidationPipe());

  // const seedService = app.get(SeedService);
  // await seedService.seed();

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

  const port = configService.getPort();
  await app.listen(port);

  if (configService.isDevelopment()) {
    console.log(`🚀 Application is running on: http://localhost:${port}`);
    console.log(`📝 Environment: ${configService.app.env}`);
    console.log(`📊 Log Level: ${configService.logLevel}`);
  }
}
bootstrap();
