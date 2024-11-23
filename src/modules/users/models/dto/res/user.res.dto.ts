import { PickType } from '@nestjs/swagger';

import { BaseResDto } from './base_user.res.dto';

export class UserResDto extends PickType(BaseResDto, [
  'id',
  'name',
  'email',
  'phone',
  'accountType',
  'role',
  'dealership',
  'avatar',
]) {}
// PickType() дозволяє "вибрати" тільки конкретні поля з базового класу
// і використовувати їх у новому DTO.
//
//OmitType() дозволяє створювати нові DTO на основі існуючих,
// але на відміну від PickType, він виключає (омітить) певні поля з базового класу.
