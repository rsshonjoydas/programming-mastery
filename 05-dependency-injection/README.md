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
