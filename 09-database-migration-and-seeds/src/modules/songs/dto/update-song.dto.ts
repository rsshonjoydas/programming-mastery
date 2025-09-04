// import {
//   IsArray,
//   IsDateString,
//   IsMilitaryTime,
//   IsNumber,
//   IsOptional,
//   IsString,
// } from 'class-validator';

// export class UpdateSongDTO {
//   @IsString()
//   @IsOptional()
//   readonly title;

//   @IsOptional()
//   @IsArray()
//   // @IsString({ each: true })
//   @IsNumber({}, { each: true })
//   readonly artists;

//   @IsDateString()
//   @IsOptional()
//   readonly releasedDate: Date;

//   @IsMilitaryTime()
//   @IsOptional()
//   readonly duration: Date;
// }

import { PartialType } from '@nestjs/mapped-types';
import { CreateSongDTO } from './create-song.dto';

export class UpdateSongDTO extends PartialType(CreateSongDTO) {}
