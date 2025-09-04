import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CreateAlbumDTO } from './dto/create-album.dto';
import { Album, AlbumDocument } from './schemas/album.schema';

import { Song } from '@/modules/songs/schemas/song.schema';

@Injectable()
export class AlbumService {
  constructor(
    @InjectModel(Album.name)
    private readonly albumModel: Model<AlbumDocument>,
  ) {}

  async createAlbum(createAlbumDTO: CreateAlbumDTO): Promise<Album> {
    return this.albumModel.create(createAlbumDTO);
  }

  async findAlbums() {
    return this.albumModel.find().populate('songs', null, Song.name);
  }
}
