# PostgreSQL with Type ORM

In this lesson, the application will be connected to a `database`, utilizing `TypeORM` as the bridge between object-oriented code and SQL queries in a Nest.js context. As a best practice, isolating database connection configurations into environment variables ensures both security and easier environment management. Learning how to connect Nest.js applications to a Postgres database provides a comprehensive understanding of backend architecture, an area where Nest.js offers more out of the-box features compared to Express.

## PostgreSQL Database Setup

### Install some dependencies

```bash
pnpm i @nestjs/typeorm pg typeorm
```

### Import `TypeORM` Module to App Module

`AppModule` is our root module, we have to configure the `TypeORM` module here

`app.module.ts`

```tsx
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      database: 'spotify-clone',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'root',
      entities: [], // add entity
      synchronize: true,
    }),
    SongsModule,
  ],
```

**OR using `env` config**

```tsx
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('POSTGRES_HOST'),
        port: configService.get<number>('POSTGRES_PORT'),
        username: configService.get<string>('POSTGRES_USER'),
        password: configService.get<string>('POSTGRES_PASSWORD'),
        database: configService.get<string>('POSTGRES_DB'),
        entities: [],
        synchronize: true, // Warning: Use only in development
      }),
      inject: [ConfigService],
    }),
```

- Importing the `TypeORM` module into `AppModule` requires calling the `forRoot` method. `NestJS` streamlines manual configuration for integrating with databases by providing built-in methods like `forRoot` that make it easier to set up a database connection. As a best practice, separating database connection logic into a dedicated configuration file is advised for easier management and scalability.
- The setting synchronize: true is risky for production as it can result in data loss. As a good practice, maintaining separate configurations for development and production environments ensures database integrity.
- After creating a new entity, it must be added to a specified array. `NestJS` promotes organization by having entities declared in a central location. A best practice is to maintain an index or a barrel file that exports all entities, thus making it easier to manage them.
- The `forRoot()` method accepts all configuration properties exposed by the `DataSource` constructor in the `TypeORM` package. As a good practice, encapsulating these settings in environment variables offers both security and ease of management.
- Providing a username and DB password is essential, and no database with the name n-test will exist by default. In `NestJS`, tools like PG-ADMIN allow for a graphical interface to interact with the Postgres Database. A good practice is to use a secure vault or environment variables for storing sensitive information like usernames and passwords.

### Test the DB Connection

`app.module.ts`

```tsx
export class AppModule implements NestModule {
  constructor(private dataSource: DataSource) {
    console.log(dataSource.driver.database);
  }
}
```

Testing the database connection can be accomplished by injecting the `datasource` class into `AppModule`, followed by logging the name of the database. Upon running the application, the database name will appear in the logs, signifying a successful connection between the `NestJS` application and the database.

Utilizing dependency injection for the `datasource` class promotes a modular and easily testable codebase, aligning with industry best practices. Additionally, logging crucial steps, such as successful database connections, aids in debugging and monitoring, also considered a best practice
