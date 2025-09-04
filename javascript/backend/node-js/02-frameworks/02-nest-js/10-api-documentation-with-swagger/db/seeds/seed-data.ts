import { faker } from '@faker-js/faker';
import * as bcrypt from 'bcryptjs';
import { EntityManager } from 'typeorm';
import { v4 as uuid4 } from 'uuid';

import { Artist } from 'src/modules/artists/artist.entity';
import { Playlist } from 'src/modules/playlists/playlist.entity';
import { User } from 'src/modules/users/user.entity';

// export const seedData = async (manager: EntityManager): Promise<void> => {
//   await seedUser();
//   await seedArtist();
//   await seedPlayLists();

//   async function seedUser() {
//     const salt = await bcrypt.genSalt();
//     const encryptedPassword = await bcrypt.hash('123456', salt);
//     const user = new User();
//     user.firstName = faker.person.firstName();
//     user.lastName = faker.person.lastName();
//     user.email = faker.internet.email();
//     user.password = encryptedPassword;
//     user.apiKey = uuid4();
//     await manager.getRepository(User).save(user);
//   }

//   async function seedArtist() {
//     const salt = await bcrypt.genSalt();
//     const encryptedPassword = await bcrypt.hash('123456', salt);
//     const user = new User();
//     user.firstName = faker.person.firstName();
//     user.lastName = faker.person.lastName();
//     user.email = faker.internet.email();
//     user.password = encryptedPassword;
//     user.apiKey = uuid4();
//     const artist = new Artist();
//     artist.user = user;
//     await manager.getRepository(User).save(user);
//     await manager.getRepository(Artist).save(artist);
//   }

//   async function seedPlayLists() {
//     const salt = await bcrypt.genSalt();
//     const encryptedPassword = await bcrypt.hash('123456', salt);
//     const user = new User();
//     user.firstName = faker.person.firstName();
//     user.lastName = faker.person.lastName();
//     user.email = faker.internet.email();
//     user.password = encryptedPassword;
//     user.apiKey = uuid4();
//     const playList = new Playlist();
//     playList.name = faker.music.genre();
//     playList.user = user;
//     await manager.getRepository(User).save(user);
//     await manager.getRepository(Playlist).save(playList);
//   }
// };

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
