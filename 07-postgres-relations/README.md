# PostgreSQL Relations

## One to One Relation

One-to-one is a relational database design pattern where entity A contains only one instance of entity B, and vice versa, ensuring a bijective mapping. In a Nest.js application with `TypeORM`, this might manifest as a user entity having a one-to-one relation with an artist entity, meaning a user can become an artist, and an artist can have only a single user profile. This design is governed by the Single Responsibility Principle, as each entity is responsible for a distinct set of attributes and behaviors, thereby simplifying database management and application logic.

### Create Artist Entity

`artist.entity.ts`

```tsx
import { Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('artists')
export class Artist {
  @PrimaryGeneratedColumn()
  id: number;
}
```

Define the Artist entity starting with one field, using the `@Entity` decorator to map it to a database table. Extend the entity by adding more columns or fields as needed, guided by the application’s requirements and domain model. This flexibility allows you to tailor the entity to fit various use cases.

### **Create User Entity**

`user.entity.ts`

```tsx
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;
}
```

Create a User entity in the application, including fields for `firstName`, `lastName`, `email`, and `password`. Use appropriate data types and decorators to define these fields.

### **Add One to One Relation**

```tsx
@Entity('artists')
export class Artist {
  // A user can register as an artist
  // Each artist will have only a user profile
  @OneToOne(() => User)
  @JoinColumn()
  user: User;
}
```

Utilize TypeORM’s @OneToOne decorator to specify the target relation type, which in this case is User. Include the @JoinColumn to ensure that the Artist entity possesses the relation ID or foreign key; this will result in the Artist table having `userId` as a foreign key.

### Register User and Artist in `AppModule`

```tsx
entities: [Song, Artist, User],
```

Register the newly created entities in the `TypeORM` module to integrate them into your Nest.js application. This can be done within the `AppModule`, making it a focal point for configuring these database entities. Following the Dependency Injection design pattern, this allows your application to be extensible and maintainable by centralizing the registration process.
