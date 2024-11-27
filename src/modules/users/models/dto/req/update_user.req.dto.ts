import { PartialType, PickType } from '@nestjs/mapped-types';

import { BaseUserReqDto } from './base_user.req.dto';

export class UpdateUserReqDto extends PartialType(
  PickType(BaseUserReqDto, ['name', 'phone'] as const),
) {}

// PickType: вибирає лише поля name, phone, і avatar з BaseUserReqDto.
// PartialType автоматично перетворює всі поля базового класу (BaseUserReqDto) на необов’язкові.
