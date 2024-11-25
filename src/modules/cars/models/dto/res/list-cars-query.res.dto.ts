import { CarsBrandsEntity } from '../../../../../infrastructure/postgres/entities/cars_brands.entity';
import { ListCarsQueryReqDto } from '../req/list-cars-query.req.dto';

export class ListBrandResQueryDto extends ListCarsQueryReqDto {
  cars: CarsBrandsEntity[];
  // масив постів
  total: number;
  // кількість постів
}
