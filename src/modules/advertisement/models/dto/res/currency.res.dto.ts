import { PickType } from '@nestjs/swagger';

import { AdvertisementResDto } from './advertisement.res.dto';

export class CurrencyResDto extends PickType(AdvertisementResDto, [
  'curBuyingUSD',
  'curSalesUSD',
  'curBuyingEUR',
  'curSalesEUR',
]) {}
