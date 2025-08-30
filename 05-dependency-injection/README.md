# Dependency Injection

## **Custom Providers**

- Constructor-based dependency injection is utilized for injecting instances, often service providers like `SongsService`, into classes using `constructor(private songsService: SongService)`. This approach is in contrast to frameworks like Express, where dependency injection is not natively supported and often requires third-party libraries for similar functionality. As a best practice, constructor-based injection is preferred for its explicitness and ease of testing.
- When the Nest `IoC (Inversion of Control)` container creates an instance of `SongsController`, it scans for any dependencies, such as `SongsService`. Upon identifying the dependency, Nest instantiates `SongsService`, caches it, and returns the instance, reusing the existing one if already cached. This differs from Express, which generally lacks a built-in `IoC`container, requiring manual instantiation or third-party solutions. Leveraging caching for service instances can lead to performance optimization.

## Injection providers

### **Standard Providers**

These are classes that get instantiated by the `NestJS` dependency injection system. Unlike in Express, where dependency injection must often be implemented manually or through third-party libraries, `NestJS` provides this feature natively. As a best practice, leverage standard providers for services that require instantiation.

`song.module.ts`

```tsx
@Module({
  controllers: [SongsController],
  providers: [SongsService],
})
```

This is the standard provider technique, you have used in our application. You can also convert the above syntax into this syntax

`song.module.ts`

```tsx
@Module({
  controllers: [SongsController],
  providers: [
    {
      provide: SongsService,
      useClass: SongsService,
    },
  ],
})
```

### **Value Providers**

These are hard-coded values or configurations injected into other classes. This feature can replace the need for environment variables or configuration files, which in frameworks like Express, would typically be managed by separate packages. Using value providers for constants and configuration settings contributes to code maintainability.

`songs.module.ts`

```tsx
const mockSongsService = {
  findAll() {
    return [
      {
        id: 1,
        title: 'Lasting love',
        artists: ['Siagla', 'Martin', 'John'],
      },
    ];
  },
};

@Module({
  controllers: [SongsController],
  providers: [
    {
      provide: SongsService,
      useValue: mockSongsService,
    },
  ],
})
```

The `useValue` syntax is useful for injecting a constant value, putting an external library into the Nest container, or replacing a real implementation with a mock object. Let’s say you’d like to force Nest to use a mock `SongsService`for testing purposes.

When you send `GET` request to localhost:3000/songs it will run the`findAll()` method from `mockSongsService` instead of original `SongsService`

### **Non-Class based Provider Tokens**

These are custom tokens that can be used to inject values or services. Unlike in frameworks like Django, which relies more on function-based views and doesn’t have a direct equivalent, `NestJS` allows greater flexibility in dependency injection. Use custom tokens judiciously to avoid overly complex dependency graphs.

`src/common/constants/connection.ts`

```tsx
export type Connection = {
  CONNECTION_STRING: string;
  DB: string;
  DB_NAME: string;
};

export const connection: Connection = {
  CONNECTION_STRING: 'postgresql://admin:password@localhost:5432/nestjs-db',
  DB: 'POSTGRES',
  DB_NAME: 'TEST',
};
```

To inject an object as a dependency, `useValue` can be utilized. This feature distinguishes `NestJS` from frameworks like Express, where manual constructor-based injection is often the norm. In the case at hand, a new file named `connection.ts` has been created, containing a connection object with `CONNECTION_STRING`, `DB` and `DB_NAME`. As a best practice, keeping connection configurations in separate files and importing them as needed ensures a modular and easily configurable application setup.

`songs.module.ts`

```tsx
@Module({
  controllers: [SongsController],
  providers: [
    SongsService,
    // Non class based providers
    // You can use it to add constant values
    {
      provide: 'CONNECTION',
      useValue: connection,
    },
  ],
})
export class SongsModule {}
```

The connection object can now be injected into any controller or service within the `SongsModule`. This contrasts with frameworks like Express, where dependency injection isn’t native and often requires third-party libraries like `Awilix` for similar functionality. As a best practice, isolating database connections in dedicated provider files ensures more modular and maintainable code, thereby facilitating easier unit testing and separation of concerns.

`Method 1` → `songs.service.ts`

```tsx
**@Injectable()
export class SongsService {
  constructor(
    @Inject('CONNECTION')
    connection: Connection,
  ) {
    console.log('connection string', connection.CONNECTION_STRING);
  }

 // previous code...
}**
```

`Method 2` → `songs.controller.ts`

```tsx
@Controller('songs')
export class SongsController {
  constructor(
    private songsService: SongsService,
    @Inject('CONNECTION')
    private connection: Connection,
  ) {
    console.log(
      `This is connection string ${this.connection.CONNECTION_STRING}`,
    );
  }
  // previous code...
}
```

I have injected this connection object into `SongsService` or `SongsController` by using the `@Inject` decorator with the token name `CONNECTION`
