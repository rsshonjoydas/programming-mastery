# Database Migration and Seed

## PostgreSQL Database Migration

### Step 1: Move `TypeORM` config into a separate file

You have to create a new folder with the database name in the root directory and create a new file `db/data-source.ts`

```tsx
import { DataSource, DataSourceOptions } from 'typeorm';

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'root',
  database: 'n-test',
  entities: ['dist/**/*.entity.js'], // Step 1
  synchronize: false, // Step 2
  migrations: ['dist/db/migrations/*.js'], // Step 3
};

const dataSource = new DataSource(dataSourceOptions); // Step 4
export default dataSource;
```

1. Now you don't need to register the entity manually. `TypeORM` will find the entities by itself.
2. When you are working with migrations you have to set the synchronize to false because our
   migration file will update the changes in the database
3. You have to provide the path of migration where you want to store. I chose the `dist` folder. I
   will run the migrations as a `js` file. That's why we need to build the project before running
   `typeorm` migrations
4. We will use this data source object when we generate/run the migrations with `typeorm cli`

### Step 2: Refactor `TypeORM` config in `AppModule`

`app.module.ts`

```tsx
import { dataSourceOptions } from 'db/data-source';

imports: [TypeOrmModule.forRoot(dataSourceOptions)];
```

### Step 3: Migration scripts in `package.json` file

`package.json`

```json
    "typeorm": "npm run build && npx typeorm -d dist/db/data-source.js",
    "migration:generate": "npm run typeorm -- migration:generate",
    "migration:run": "npm run typeorm -- migration:run",
    "migration:revert": "npm run typeorm -- migration:revert"
```

### Step 4: Add a new column in any Entity

I am thinking about adding a phone column in the user entity. Maybe, the requirements changed after 3 months and you have to add a new column in the user entity.

`user.entity.ts`

```tsx
@Column()
phone: string
```

Now you have to update the user table using migrations.

```bash
npm run migration:generate --db/migrations/add-user-phone
```

- **`db/migrations`:** I am telling `typeorm` I want to save migrations in this folder
- **add-user-phone:** This is the name of the migration

It will generate a new migration file inside the migrations folder

Now you have to run the migration by using this command

```bash
npm run migration:run
```

This command will alter/update the user table in the database

You can see the users table in the database and see the phone column there.

## Data Seeding

### What is Data Seeding

Data seeding is the process of populating a database with an initial set of data. Applying seed data to a database refers to the process of inserting initial data into a database, usually when the database is first created. This data serves as a baseline and can be used for testing, and development, and to provide some context for the application that will be built on top of the database.

### Install Dependencies

I am going to use an external package to generate fake/mock data.

```bash
pnpm install @faker-js/faker
```

### Create a file `db/seeds/seed-data.ts` directory

```tsx
import { faker } from '@faker-js/faker';
import * as bcrypt from 'bcryptjs';
import { EntityManager } from 'typeorm';
import { v4 as uuid4 } from 'uuid';

import { Artist } from 'src/modules/artists/artist.entity';
import { Playlist } from 'src/modules/playlists/playlist.entity';
import { User } from 'src/modules/users/user.entity';

export const seedData = async (manager: EntityManager): Promise<void> => {
  await seedUser();
  await seedArtist();
  await seedPlayLists();

  async function seedUser() {
    const salt = await bcrypt.genSalt();
    const encryptedPassword = await bcrypt.hash('123456', salt);
    const user = new User();
    user.firstName = faker.person.firstName();
    user.lastName = faker.person.lastName();
    user.email = faker.internet.email();
    user.password = encryptedPassword;
    user.apiKey = uuid4();
    await manager.getRepository(User).save(user);
  }

  async function seedArtist() {
    const salt = await bcrypt.genSalt();
    const encryptedPassword = await bcrypt.hash('123456', salt);
    const user = new User();
    user.firstName = faker.person.firstName();
    user.lastName = faker.person.lastName();
    user.email = faker.internet.email();
    user.password = encryptedPassword;
    user.apiKey = uuid4();
    const artist = new Artist();
    artist.user = user;
    await manager.getRepository(User).save(user);
    await manager.getRepository(Artist).save(artist);
  }

  async function seedPlayLists() {
    const salt = await bcrypt.genSalt();
    const encryptedPassword = await bcrypt.hash('123456', salt);
    const user = new User();
    user.firstName = faker.person.firstName();
    user.lastName = faker.person.lastName();
    user.email = faker.internet.email();
    user.password = encryptedPassword;
    user.apiKey = uuid4();
    const playList = new Playlist();
    playList.name = faker.music.genre();
    playList.user = user;
    await manager.getRepository(User).save(user);
    await manager.getRepository(Playlist).save(playList);
  }
};
```

**Alternative: seed function to create a specific number of records:**

```tsx
import { faker } from '@faker-js/faker';
import * as bcrypt from 'bcryptjs';
import { EntityManager } from 'typeorm';
import { v4 as uuid4 } from 'uuid';

import { Artist } from 'src/modules/artists/artist.entity';
import { Playlist } from 'src/modules/playlists/playlist.entity';
import { User } from 'src/modules/users/user.entity';

interface SeedOptions {
  users?: number;
  artists?: number;
  playlists?: number;
}

export const seedData = async (
  manager: EntityManager,
  options: SeedOptions = { users: 10, artists: 5, playlists: 15 },
): Promise<void> => {
  console.log('🌱 Starting optimized database seeding...');

  // Helper function to create encrypted password
  async function createEncryptedPassword(): Promise<string> {
    const salt = await bcrypt.genSalt();
    return await bcrypt.hash('123456', salt);
  }

  // Bulk seed users
  if (options.users && options.users > 0) {
    console.log(`📝 Creating ${options.users} users...`);
    const users: User[] = [];
    const encryptedPassword = await createEncryptedPassword();

    for (let i = 0; i < options.users; i++) {
      const user = new User();
      user.firstName = faker.person.firstName();
      user.lastName = faker.person.lastName();
      user.email = faker.internet.email();
      user.password = encryptedPassword;
      user.apiKey = uuid4();
      // user.phone = faker.phone.number();
      users.push(user);
    }

    await manager.getRepository(User).save(users);
  }

  // Bulk seed artists
  if (options.artists && options.artists > 0) {
    console.log(`🎨 Creating ${options.artists} artists...`);
    const users: User[] = [];
    const artists: Artist[] = [];
    const encryptedPassword = await createEncryptedPassword();

    for (let i = 0; i < options.artists; i++) {
      const user = new User();
      user.firstName = faker.person.firstName();
      user.lastName = faker.person.lastName();
      user.email = faker.internet.email();
      user.password = encryptedPassword;
      user.apiKey = uuid4();
      // user.phone = faker.phone.number();
      users.push(user);
    }

    const savedUsers = await manager.getRepository(User).save(users);

    savedUsers.forEach((user) => {
      const artist = new Artist();
      artist.user = user;
      artists.push(artist);
    });

    await manager.getRepository(Artist).save(artists);
  }

  // Bulk seed playlists
  if (options.playlists && options.playlists > 0) {
    console.log(`🎵 Creating ${options.playlists} playlists...`);
    const users: User[] = [];
    const playlists: Playlist[] = [];
    const encryptedPassword = await createEncryptedPassword();

    for (let i = 0; i < options.playlists; i++) {
      const user = new User();
      user.firstName = faker.person.firstName();
      user.lastName = faker.person.lastName();
      user.email = faker.internet.email();
      user.password = encryptedPassword;
      user.apiKey = uuid4();
      // user.phone = faker.phone.number();
      users.push(user);
    }

    const savedUsers = await manager.getRepository(User).save(users);

    savedUsers.forEach((user, index) => {
      const playlist = new Playlist();
      playlist.name = faker.music.genre() + ' Mix ' + (index + 1);
      playlist.user = user;
      playlists.push(playlist);
    });

    await manager.getRepository(Playlist).save(playlists);
  }

  console.log('✅ Optimized database seeding completed!');
};
```

**Usage examples:**

```tsx
// Default usage (10 users, 5 artists, 15 playlists)
// await seedData(manager);

// Custom counts
// await seedData(manager, { users: 50, artists: 20, playlists: 100 });

// Only seed users
// await seedData(manager, { users: 25 });

// Only seed artists and playlists
// await seedData(manager, { artists: 10, playlists: 30 });

// Zero users, only artists
// await seedData(manager, { users: 0, artists: 15, playlists: 0 });
```

1. I have created a `seedData` method with an entity manager argument. I will get the repository for each entity by calling the `getRepository`. This is how you can create mock data
2. I have used the Faker package to generate mock data. You can see the functions `faker.person.firstName()`. You can explore methods from Faker by looking at the documentation

### Create a new seed modules

```bash
nest g module modules/seed && nest g service modules/seed --no-spec
```

`seed.module.ts`

```tsx
import { Module } from '@nestjs/common';

import { SeedService } from './seed.service';

@Module({
  providers: [SeedService],
})
export class SeedModule {}
```

`seed.service.ts`

```tsx
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
```

1. A Query Runner can be used to manage and work with a single real database data source. Each new `QueryRunner` instance takes a single connection from the connection pool if `RDBMSsupports` connection pooling. For databases not supporting connection pools, it uses the same connection across data source.
2. Use the connect method to actually obtain a connection from the connection pool.
3. `QueryRunner` provides a single database connection. Transactions are organized using query runners. Single transactions can only be established on a single query runner. You can manually create a query runner instance and use it to manually control transaction state.
4. Commit the Transaction
5. If we have errors let's rollback changes we made
6. Make sure to release it when it is not needed anymore to make it available to the connection pool again

### Run the Seeds

`main.ts`

```tsx
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from '@/app.module';
import { SeedService } from '@/modules/seed/seed.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  const seedService = app.get(SeedService);
  await seedService.seed();

  await app.listen(3001);
}
bootstrap();
```

This is an entry file, `Nestjs` will run this file to bootstrap the application, whenever you run the
application it will create new data and save it to DB. When you don't need new data you can disable
these two lines:

```tsx
// const seedService = app.get(SeedService);
// await seedService.seed();
```
