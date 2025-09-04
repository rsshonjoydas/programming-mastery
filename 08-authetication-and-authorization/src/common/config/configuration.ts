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
