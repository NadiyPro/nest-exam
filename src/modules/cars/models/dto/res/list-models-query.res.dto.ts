import { CarsModelsEntity } from '../../../../../infrastructure/postgres/entities/cars_models.entity';
import { ListCarsQueryReqDto } from '../req/list-cars-query.req.dto';

export class ListModelsResQueryDto extends ListCarsQueryReqDto {
  cars: CarsModelsEntity[];
  total: number;
}
