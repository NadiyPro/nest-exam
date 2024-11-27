import { IsEnum, IsNotEmpty } from 'class-validator';

import { RoleTypeEnum } from '../../../enums/RoleType.enum';

export class GiveRoleDto {
  @IsNotEmpty()
  @IsEnum(RoleTypeEnum)
  new_role: RoleTypeEnum;

  // @IsNotEmpty()
  // @IsEnum(RoleTypeEnum)
  // current_role: RoleTypeEnum;
}
