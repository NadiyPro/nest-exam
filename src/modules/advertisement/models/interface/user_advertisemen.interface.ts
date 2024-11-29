import { PickType } from '@nestjs/swagger';

import { BaseResDto } from '../../../users/models/dto/res/base_user.res.dto';

export class IAdvertisemen extends PickType(BaseResDto, [
  'id',
  'name',
  'phone',
  'accountType',
]) {}
