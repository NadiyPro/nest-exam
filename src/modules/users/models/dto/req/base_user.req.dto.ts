import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsOptional, IsString, Length, Matches } from 'class-validator';

import { TransformHelper } from '../../../../../common/helpers/transform.helper';
import { AccountTypeEnum } from '../../../../auth/enums/AccountType.enum';
import { RoleTypeEnum } from '../../../enums/RoleType.enum';

export class BaseUserReqDto {
  @IsString()
  @Length(3, 50)
  @Transform(TransformHelper.trim)
  @Type(() => String)
  name: string;

  @IsOptional()
  @IsString()
  @Length(0, 3000)
  avatar?: string;

  @ApiProperty({ example: '+380123456789' })
  @IsString()
  @Length(12)
  @Transform(TransformHelper.trim)
  @Matches(
    /\(?\+[0-9]{1,3}\)? ?-?[0-9]{1,3} ?-?[0-9]{3,5} ?-?[0-9]{4}( ?-?[0-9]{3})? ?(\w{1,10}\s?\d{1,6})?/,
  )
  phone: string;

  @ApiProperty({ example: 'test@gmail.com' })
  @IsString()
  @Length(0, 300)
  @Matches(/^[^\s@]+@([^\s@.,]+\.)+[^\s@.,]{2,}$/)
  email: string;

  @ApiProperty({ example: 'gNe1fe!3hfrw#NtP' })
  @IsString()
  @Length(0, 300)
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%_*#?&])[A-Za-z\d@$_!%*#?&]{8,}$/)
  password: string;

  @ApiProperty({ example: 'basic' })
  @IsString()
  @Length(3, 50)
  @Transform(TransformHelper.trim)
  @Transform(TransformHelper.toLowerCaseArray)
  accountType: AccountTypeEnum;

  @ApiProperty({ example: 'dealership' })
  @IsOptional()
  @IsString()
  @Length(3, 50)
  dealership?: string;

  @ApiProperty({ example: 'seller' })
  @IsString()
  @Length(3, 50)
  role: RoleTypeEnum;
}
