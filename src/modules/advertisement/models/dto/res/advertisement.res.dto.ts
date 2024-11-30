import { IsValidEnum } from '../../../../../infrastructure/postgres/entities/enums/isValid.enum';
import { CurrencyEnum } from '../../../enums/currency_enum';

export class AdvertisementResDto {
  id: string;
  user_id: string;
  name: string;
  phone: string;
  brands_name: string;
  models_name: string;
  price: number;
  original_currency: CurrencyEnum;
  region: string;
  text_advertisement: string;
  curBuyingUSD: number;
  curSalesUSD: number;
  curBuyingEUR: number;
  curSalesEUR: number;
  priceUSD: number;
  priceEUR: number;
  priceUAH: number;
  // image_cars: string;
  // isValid: IsValidEnum;
}
