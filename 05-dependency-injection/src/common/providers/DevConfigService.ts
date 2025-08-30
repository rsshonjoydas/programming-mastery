import { Injectable } from '@nestjs/common';

@Injectable()
export class DevConfigService {
  DB_HOST = 'localhost';
  getDB_HOST() {
    return this.DB_HOST;
  }
}
