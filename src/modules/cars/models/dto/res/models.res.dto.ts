import { PickType } from '@nestjs/swagger';

import { CarsResDto } from './cars.res.dto';

export class CarsModelsResDto extends PickType(CarsResDto, [
  'id',
  'models_name',
  'user_id',
]) {}
