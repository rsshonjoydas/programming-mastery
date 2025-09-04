import {
  ArrayMinSize,
  IsArray,
  IsMongoId,
  IsNotEmpty,
  IsString,
} from 'class-validator';

export class CreateAlbumDTO {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsArray()
  @ArrayMinSize(1)
  @IsMongoId({ each: true })
  songs: string[];
}
