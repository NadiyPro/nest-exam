import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  Length,
} from 'class-validator';

import { CurrencyEnum } from '../../../enums/currency_enum';

export class AdvertisementReqDto {
  @IsString()
  @Length(2, 50)
  brands_name: string;

  @IsString()
  @Length(2, 50)
  models_name: string;

  @ApiProperty({ example: 20000 })
  @IsNumber()
  @Type(() => Number)
  price: number;

  @ApiProperty({ example: 'UAH' })
  @IsString()
  original_currency: 'USD' | 'EUR' | 'UAH';

  @ApiProperty({ example: 'Dnipro' })
  @IsString()
  @Length(3, 30)
  region: string;

  @IsString()
  @Length(10, 400)
  text_advertisement: string;
}
