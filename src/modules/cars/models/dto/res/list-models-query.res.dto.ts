import { ListCarsQueryReqDto } from '../req/list-cars-query.req.dto';
import { CarsModelsResDto } from './models.res.dto';

export class ListModelsResQueryDto extends ListCarsQueryReqDto {
  cars: CarsModelsResDto[];
  total: number;
}
