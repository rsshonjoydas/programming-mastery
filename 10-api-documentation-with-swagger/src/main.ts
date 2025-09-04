import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

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

  const port = configService.getPort();
  await app.listen(port);

  if (configService.isDevelopment()) {
    console.log(`🚀 Application is running on: http://localhost:${port}`);
    console.log(`📝 Environment: ${configService.app.env}`);
    console.log(`📊 Log Level: ${configService.logLevel}`);
  }
}
bootstrap();
