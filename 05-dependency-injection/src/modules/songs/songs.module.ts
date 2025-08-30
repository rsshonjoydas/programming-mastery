import { Module } from '@nestjs/common';

import { SongsController } from './songs.controller';
import { SongsService } from './songs.service';

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
export class SongsModule {}
