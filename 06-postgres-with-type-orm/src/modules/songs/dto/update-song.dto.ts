// import {
//   IsArray,
//   IsDateString,
//   IsMilitaryTime,
//   IsOptional,
//   IsString,
// } from 'class-validator';

// export class UpdateSongDTO {
//   @IsString()
//   @IsOptional()
//   readonly title;

//   @IsOptional()
//   @IsArray()
//   @IsString({ each: true })
//   readonly artists;

//   @IsDateString()
//   @IsOptional()
//   readonly releasedDate: Date;

//   @IsMilitaryTime()
//   @IsOptional()
//   readonly duration: Date;

//   @IsString()
//   @IsOptional()
//   readonly lyrics: string;
// }

import { PartialType } from '@nestjs/mapped-types';
import { CreateSongDTO } from './create-song.dto';

export class UpdateSongDTO extends PartialType(CreateSongDTO) {}
