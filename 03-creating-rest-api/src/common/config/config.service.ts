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
