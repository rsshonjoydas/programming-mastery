# Basic Configuration Setup

This guide covers setting up basic environment configuration with Node environment, port, and logging settings.

## 📋 Prerequisites

- `NestJS` application
- Zod for validation
- @nestjs/config module
- cross-env for environment variables across different operating systems

## 🚀 Initial Setup

### 1. Install Dependencies

```bash
pnpm i @nestjs/config zod; pnpm i -D cross-env
```

### 2. Create Basic Environment Files

Create these files in your project root:

```bash
touch .env .env.development .env.production .env.test
```

**Add to `.gitignore`:**

```text
.env*
!.env.example
```

## 📁 File Structure

```text
src/
├── common/
│  └── config/
│       ├── env.validation.ts
│       ├── configuration.ts
│       └── config.service.ts
├── app.module.ts
└── main.ts
```

## 📄 Implementation

### 1. Environment Validation (`env.validation.ts`)

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

### 2. Configuration (`configuration.ts`)

```tsx
import { registerAs } from '@nestjs/config';

export const appConfig = registerAs(
  'app',
  (): AppConfiguration => ({
    env: process.env.NODE_ENV as 'development' | 'production' | 'test',
    port: parseInt(`${process.env.PORT}`, 10) || 3000,
    isDevelopment: process.env.NODE_ENV === 'development',
    isProduction: process.env.NODE_ENV === 'production',
    isTest: process.env.NODE_ENV === 'test',
    logLevel: (process.env.LOG_LEVEL as LogLevel) || 'info',
  }),
);

// Type definitions
export type LogLevel = 'error' | 'warn' | 'info' | 'debug';

export interface AppConfiguration {
  env: 'development' | 'production' | 'test';
  port: number;
  isDevelopment: boolean;
  isProduction: boolean;
  isTest: boolean;
  logLevel: LogLevel;
}
```

### 3. Typed Configuration Service (`config.service.ts`)

```tsx
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { AppConfiguration, LogLevel } from './configuration';

@Injectable()
export class TypedConfigService {
  constructor(private configService: ConfigService) {}

  get app(): AppConfiguration {
    return this.configService.get<AppConfiguration>('app')!;
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

### 4. App Module (`app.module.ts`)

```tsx
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { validateEnvironment } from './config/env.validation';
import { appConfig } from './config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      expandVariables: true,
      envFilePath: ['.env.local', `.env.${process.env.NODE_ENV}`, '.env'],
      load: [appConfig],
      validate: validateEnvironment,
    }),
    // ... other modules
  ],
  providers: [TypedConfigService], // Add this if you want to inject it
})
export class AppModule {}
```

### 5. Main Application (`main.ts`)

```tsx
import { NestFactory } from '@nestjs/core';

import { AppModule } from '@/app.module';
import { TypedConfigService } from '@/common/config/config.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Get typed config service
  const configService = app.get(TypedConfigService);

  const port = configService.getPort();
  await app.listen(port);

  if (configService.isDevelopment()) {
    console.log(`🚀 Application is running on: http://localhost:${port}`);
    console.log(`📝 Environment: ${configService.app.env}`);
    console.log(`📊 Log Level: ${configService.logLevel}`);
  }
}
bootstrap();
```

## 🔧 Environment Variables

### `.env` File

```text
# Application Environment
NODE_ENV=development

# Server Configuration
PORT=3000

# Logging Configuration
LOG_LEVEL=info
```

### Environment Examples

### `.env.development`

```text
NODE_ENV=development
PORT=3000
LOG_LEVEL=debug
```

### `.env.production`

```text
NODE_ENV=production
PORT=8080
LOG_LEVEL=warn
```

### `.env.test`

```text
NODE_ENV=test
PORT=3001
LOG_LEVEL=error
```

## 📊 Usage Examples

### Using Configuration in Services

```tsx
@Injectable()
export class SomeService {
  constructor(private configService: TypedConfigService) {}

  someMethod() {
    const port = this.configService.getPort();
    const isDev = this.configService.isDevelopment();
    const logLevel = this.configService.logLevel;

    if (this.configService.shouldLog('debug')) {
      console.log('Debug information');
    }
  }
}
```

### Conditional Logic Based on Environment

```tsx
@Injectable()
export class DatabaseService {
  constructor(private configService: TypedConfigService) {}

  getConnectionOptions() {
    if (this.configService.isProduction()) {
      return {
        // Production database config
        ssl: true,
        logging: false,
      };
    }

    return {
      // Development database config
      ssl: false,
      logging: true,
    };
  }
}
```

## 📋 `Package.json` Scripts

Add these scripts to your `package.json`:

```json
{
  "scripts": {
    "start": "nest start",
    "start:dev": "cross-env NODE_ENV=development nest start --watch",
    "start:debug": "cross-env NODE_ENV=development nest start --debug --watch",
    "start:prod": "cross-env NODE_ENV=production node dist/main",
    "test": "cross-env NODE_ENV=test jest",
    "test:watch": "cross-env NODE_ENV=test jest --watch",
    "test:cov": "cross-env NODE_ENV=test jest --coverage",
    "test:debug": "cross-env NODE_ENV=test node --inspect-brk -r tsconfig-paths/register -r ts-node/register node_modules/.bin/jest --runInBand",
    "test:e2e": "cross-env NODE_ENV=test jest --config ./test/jest-e2e.json"
  }
}
```

## 🔍 Validation Features

- **PORT**: Must be between 1000-65535
- **NODE_ENV**: Only accepts 'development', 'production', or 'test'
- **LOG_LEVEL**: Only accepts 'error', 'warn', 'info', or 'debug'
- **Type Safety**: Full TypeScript support with proper typing
- **Default Values**: Sensible defaults for all configurations

## 🚨 Error Handling

The configuration will throw descriptive errors if validation fails:

```text
Environment validation failed:
PORT: Expected number, received string
LOG_LEVEL: Invalid enum value. Expected 'error' | 'warn' | 'info' | 'debug', received 'invalid'
```

## ✅ Best Practices

### Security

- Never commit `.env.local` files
- Use strong, unique secrets for each environment
- Keep production credentials separate from development
- Use environment variables in CI/CD instead of `.env.production`

### Organization

- Group related variables together in schemas
- Use descriptive variable names
- Set sensible defaults where appropriate
- Validate all required environment variables

### Development

- Use different database names for each environment
- Enable detailed logging in development
- Disable synchronization in production
- Use feature flags for environment-specific behavior

### Example Environment File Structure

```text
project/
├── .env                 # Shared defaults
├── .env.development     # Development overrides
├── .env.production      # Production overrides
├── .env.test            # Test overrides
├── .env.local           # Local overrides (gitignored)
└── .env.example         # Template for team members
```

## 🐛 Troubleshooting

### Common Issues

**1. Environment validation failed error:**

- Check that all required environment variables are set
- Verify variable names match exactly (case-sensitive)
- Ensure numeric values are valid numbers

**2. Type undefined is not assignable to type X:**

- Add `!` after `configService.get()` calls
- Or use `getOrThrow()` method for explicit error handling

**3. Environment files not loading:**

- Check file names are exactly `.env.development` (not `.env.dev`)
- Ensure `NODE_ENV` is set correctly
- Verify file paths in `envFilePath` array

**4. Variables not updating:**

- Restart your application after changing `.env` files
- Check if caching is enabled and clear if needed
- Verify environment variable precedence

## 📈 Benefits

- **Type Safety**: Full TypeScript support
- **Validation**: Runtime validation of environment variables
- **Default Values**: Fallbacks for missing configuration
- **Environment Aware**: Easy environment-specific logic
- **Centralized**: Single source of truth for configuration
- **Extensible**: Easy to add new configuration options
