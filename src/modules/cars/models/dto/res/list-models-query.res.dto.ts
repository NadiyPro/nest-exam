import { ListCarsQueryReqDto } from '../req/list-cars-query.req.dto';
import { CarsResDto } from './cars.res.dto';

export class ListModelsResQueryDto extends ListCarsQueryReqDto {
  cars: CarsResDto[];
  total: number;
}
