import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsString, Length, Matches } from 'class-validator';

import { TransformHelper } from '../../../../../common/helpers/transform.helper';

export class UpdateUserReqDto {
  @IsString()
  @Length(3, 50)
  @Transform(TransformHelper.trim)
  @Type(() => String)
  name: string;

  @ApiProperty({ example: '+380123456789' })
  @IsString()
  @Length(12)
  @Transform(TransformHelper.trim)
  @Matches(
    /\(?\+[0-9]{1,3}\)? ?-?[0-9]{1,3} ?-?[0-9]{3,5} ?-?[0-9]{4}( ?-?[0-9]{3})? ?(\w{1,10}\s?\d{1,6})?/,
  )
  phone: string;
}
