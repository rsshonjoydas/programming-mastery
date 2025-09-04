import { Transform } from 'class-transformer';
import {
  IsDateString,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateSongDTO {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsDateString() // Validates ISO date string format
  // @Transform(({ value }) => new Date(value as string)) // Transforms string to Date
  @Transform(({ value }): Date | undefined => {
    if (value == null) return undefined;
    if (typeof value === 'string' || typeof value === 'number') {
      const date = new Date(value);
      if (isNaN(date.getTime())) {
        throw new Error('Invalid date format');
      }
      return date;
    }
    if (value instanceof Date) return value;
    throw new Error('Invalid date format');
  })
  releasedDate: Date;

  @IsNotEmpty()
  @IsString()
  duration: string; // Fixed: was Date, should be string for duration like "3:45"

  @IsOptional()
  @IsString()
  lyrics?: string; // Made optional with ? since it's not required in schema

  @IsNotEmpty()
  @IsString()
  @IsMongoId()
  album: string; // MongoDB ObjectId as string
}
