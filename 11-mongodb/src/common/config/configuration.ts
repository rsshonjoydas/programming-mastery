import { registerAs } from '@nestjs/config';

export const appConfig = registerAs('app', (): AppConfiguration => {
  const env = process.env.NODE_ENV as 'development' | 'production' | 'test';

  return {
    env,
    port: parseInt(`${process.env.PORT}`, 10) || 3000,
    isDevelopment: env === 'development',
    isProduction: env === 'production',
    isTest: env === 'test',
    logLevel: (process.env.LOG_LEVEL as LogLevel) || 'info',
  };
});

export type LogLevel = 'error' | 'warn' | 'info' | 'debug';

export interface AppConfiguration {
  env: 'development' | 'production' | 'test';
  port: number;
  isDevelopment: boolean;
  isProduction: boolean;
  isTest: boolean;
  logLevel: LogLevel;
}
