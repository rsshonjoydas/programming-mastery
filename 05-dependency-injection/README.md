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
