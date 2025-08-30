# Dependency Injection

## **Custom Providers**

- Constructor-based dependency injection is utilized for injecting instances, often service providers like `SongsService`, into classes using `constructor(private songsService: SongService)`. This approach is in contrast to frameworks like Express, where dependency injection is not natively supported and often requires third-party libraries for similar functionality. As a best practice, constructor-based injection is preferred for its explicitness and ease of testing.
- When the Nest `IoC (Inversion of Control)` container creates an instance of `SongsController`, it scans for any dependencies, such as `SongsService`. Upon identifying the dependency, Nest instantiates `SongsService`, caches it, and returns the instance, reusing the existing one if already cached. This differs from Express, which generally lacks a built-in `IoC`container, requiring manual instantiation or third-party solutions. Leveraging caching for service instances can lead to performance optimization.
