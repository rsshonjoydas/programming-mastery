import { Module } from '@nestjs/common';

import { connection } from '@/common/constants/connection';
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
    // Standard Provider
    {
      provide: SongsService,
      useValue: SongsService,
    },

    // Value Provider
    {
      provide: SongsService,
      useValue: mockSongsService,
    },

    // Non-Class based Provider Tokens
    {
      provide: 'CONNECTION',
      useValue: connection,
    },
  ],
})
export class SongsModule {}
