import { PickType } from '@nestjs/swagger';

import { BaseAuthReqDto } from './base_auth.req.dto';

export class RegistrationReqDto extends PickType(BaseAuthReqDto, [
  'email',
  'password',
  'phone',
  'name',
  'accountType',
  // 'role',
  'deviceId',
]) {}
// PickType() дозволяє "вибрати" тільки конкретні поля з базового класу
// і використовувати їх у новому DTO
