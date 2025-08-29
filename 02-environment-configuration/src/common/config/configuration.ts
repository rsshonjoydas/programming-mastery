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
