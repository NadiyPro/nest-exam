import { PickType } from '@nestjs/swagger';
import { BaseUserReqDto } from '../../../../users/models/dto/req/base_user.req.dto';
import { IsNotEmpty, IsString } from 'class-validator';
import { CarsResDto } from './cars.res.dto';
import { Column } from 'typeorm';

export class CarsDeletedResDto extends PickType(CarsResDto, [
  'brands_id',
  'brands_name',
  'models_id',
  'models_name',
  'user_id',
]) {
  @IsNotEmpty() // перевіряє, щоб значення поля не було порожнім
  @IsString()
  readonly deleted: Date | null;
}