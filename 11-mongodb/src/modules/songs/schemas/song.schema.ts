import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type SongDocument = HydratedDocument<Song>;

@Schema({ timestamps: true }) // Adds createdAt and updatedAt automatically
export class Song {
  @Prop({
    required: true,
    trim: true,
  })
  title: string;

  @Prop({
    required: true,
  })
  releasedDate: Date;

  @Prop({
    required: true,
    trim: true,
  })
  duration: string; // Keep as string for formats like "3:45" or "03:45"

  @Prop({
    required: false, // Made optional since it wasn't marked as required
    default: '',
  })
  lyrics: string;
}

export const SongSchema = SchemaFactory.createForClass(Song);
