import { PickType } from '@nestjs/swagger';

import { BaseResDto } from '../../../../users/models/dto/res/base_user.res.dto';

export class AuthUserResDto extends PickType(BaseResDto, [
  'id',
  'name',
  'email',
  'phone',
  'accountType',
  'role',
]) {}
