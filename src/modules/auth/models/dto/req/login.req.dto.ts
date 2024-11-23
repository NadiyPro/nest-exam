import { PickType } from '@nestjs/swagger';

import { BaseAuthReqDto } from './base_auth.req.dto';

export class LoginReqDto extends PickType(BaseAuthReqDto, [
  'email',
  'password',
  'deviceId',
]) {}
// PickType() дозволяє "вибрати" тільки конкретні поля з базового класу
// і використовувати їх у новому DTO
// signIn - тут проходить аутентифікація,
// перевірка чи існує в нас такий юзер з таким то паролем,
// якщо існує то генеруємо нову пару токенів
// (повторний вхід, перевірка паролю, ат видача нової пари токенів)
