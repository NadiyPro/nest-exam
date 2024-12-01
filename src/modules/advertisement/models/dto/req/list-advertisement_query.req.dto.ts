import { Transform, Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

import { TransformHelper } from '../../../../../common/helpers/transform.helper';

export class ListAdQueryReqDto {
  @Type(() => Number)
  @IsInt()
  @Max(100)
  @Min(1)
  @IsOptional()
  limit?: number = 10;
  // ліміт відображення

  @Type(() => Number)
  @IsInt()
  @Min(0)
  @IsOptional()
  offset?: number = 0;
  // скільки пропустити skip

  @Transform(TransformHelper.toLowerCase)
  @IsString()
  @IsOptional()
  search?: string;
  // пошук по name
}
