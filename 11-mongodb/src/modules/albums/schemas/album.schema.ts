import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

import { Song } from '@/modules/songs/schemas/song.schema';

export type AlbumDocument = HydratedDocument<Album>;

@Schema({
  timestamps: true,
  collection: 'albums',
  versionKey: false, // This removes __v entirely
  // toJSON: {
  // virtuals: true,
  //   transform: (doc: Document, ret: Record<string, any>) => {
  //     delete ret.__v;
  //     return ret;
  //   },
  // transform: (doc, ret) => {
  //   delete (ret as any).__v;
  //   return ret;
  // },
  // },
  toObject: { virtuals: true },
})
export class Album {
  @Prop({
    required: true,
  })
  title: string;

  @Prop({ type: [Types.ObjectId], ref: 'songs' }) //1
  songs: Song[];
}

export const AlbumSchema = SchemaFactory.createForClass(Album);
