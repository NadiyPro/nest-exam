import { PickType } from '@nestjs/swagger';
import { IsString } from 'class-validator';

import { AdvertisementResDto } from './advertisement.res.dto';

export class AdvertisementMeResDto extends PickType(AdvertisementResDto, [
  'id',
  'user_id',
  'name',
  'phone',
  'brands_name',
  'models_name',
  'price',
  'original_currency',
  'region',
  'text_advertisement',
  'curBuyingUSD',
  'curSalesUSD',
  'curBuyingEUR',
  'curSalesEUR',
  'priceUSD',
  'priceEUR',
  'priceUAH',
  'isValid',
]) {
  @IsString()
  readonly image_cars?: string;
}
