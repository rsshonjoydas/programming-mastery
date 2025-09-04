import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

import { seedData } from '../../../db/seeds/seed-data';

@Injectable()
export class SeedService {
  constructor(private readonly connection: DataSource) {}

  async seed(): Promise<void> {
    const queryRunner = this.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const manager = queryRunner.manager;

      // Usage examples:

      // Default usage (10 users, 5 artists, 15 playlists)
      await seedData(manager);

      // Custom counts
      // await seedData(manager, { users: 50, artists: 20, playlists: 100 });

      // Only seed users
      // await seedData(manager, { users: 25 });

      // Only seed artists and playlists
      // await seedData(manager, { artists: 10, playlists: 30 });

      // Zero users, only artists
      // await seedData(manager, { users: 0, artists: 15, playlists: 0 });

      await queryRunner.commitTransaction();
    } catch (err) {
      console.log('Error during database seeding:', err);
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }
}
