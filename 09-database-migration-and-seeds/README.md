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
