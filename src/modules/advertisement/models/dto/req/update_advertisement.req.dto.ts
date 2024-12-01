import { PickType } from '@nestjs/swagger';

import { AdvertisementResDto } from '../res/advertisement.res.dto';

export class UpdateAdMeReqDto extends PickType(AdvertisementResDto, [
  'price',
  'original_currency',
  'text_advertisement',
]) {}
