// import { Transform } from 'class-transformer';
// import {
//   IsDateString,
//   IsNotEmpty,
//   IsOptional,
//   IsString,
// } from 'class-validator';

// export class UpdateSongDto {
//   @IsOptional()
//   @IsString()
//   @IsNotEmpty()
//   title?: string;

//   @IsOptional()
//   @IsDateString()
//   // @Transform(({ value }) => new Date(value as string))
//   @Transform(({ value }): Date | undefined => {
//     if (value == null) return undefined;
//     if (typeof value === 'string' || typeof value === 'number') {
//       const date = new Date(value);
//       if (isNaN(date.getTime())) {
//         throw new Error('Invalid date format');
//       }
//       return date;
//     }
//     if (value instanceof Date) return value;
//     throw new Error('Invalid date format');
//   })
//   releasedDate?: Date;

//   @IsOptional()
//   @IsString()
//   @IsNotEmpty()
//   duration?: string;

//   @IsOptional()
//   @IsString()
//   lyrics?: string;
// }

import { PartialType } from '@nestjs/mapped-types';

import { CreateSongDTO } from './create-song.dto';

export class UpdateSongDTO extends PartialType(CreateSongDTO) {}
