import { IsString, Length, Matches } from 'class-validator';
import { Column } from 'typeorm';

import { CurrencyEnum } from '../../../enums/currency_enum';

export class AdvertisementReqDto {
  @IsString()
  @Length(2, 50)
  brands_name: string;

  @IsString()
  @Length(2, 50)
  models_name: string;

  @Column('float')
  price: number;

  @Column('text', { default: CurrencyEnum.UAH })
  original_currency: CurrencyEnum;

  @Column('text')
  region: string;

  @Column('text')
  text_advertisement: string;
}
