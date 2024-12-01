import { PickType } from '@nestjs/swagger';

import { AdvertisementResDto } from '../res/advertisement.res.dto';

export class UpdateAdMeReqDto extends PickType(AdvertisementResDto, [
  'id',
  'price',
  'original_currency',
  'text_advertisement',
]) {}
