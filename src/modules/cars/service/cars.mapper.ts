import { CarsBrandsEntity } from '../../../infrastructure/postgres/entities/cars_brands.entity';
import { CarsModelsEntity } from '../../../infrastructure/postgres/entities/cars_models.entity';
import { ListCarsQueryReqDto } from '../models/dto/req/list-cars-query.req.dto';
import { CarsResDto } from '../models/dto/res/cars.res.dto';
import { ListBrandResQueryDto } from '../models/dto/res/list-brand-query.res.dto';
import { ListCarsQueryResDto } from '../models/dto/res/list-cars-query.res.dto';
import { ListModelsResQueryDto } from '../models/dto/res/list-models-query.res.dto';
// import { CarsDeletedResDto } from '../models/dto/res/cars.deleted.res.dto';

export class CarsMapper {
  public static toResCreateDto(
    models: CarsModelsEntity,
    brands: CarsBrandsEntity,
  ): CarsResDto {
    return {
      brands_id: models.brands_id,
      brands_name: brands.brands_name,
      models_id: models.models_id,
      models_name: models.models_name,
      user_id: models.user_id,
    };
  }
  // для Brands
  public static toCarData(car: CarsBrandsEntity): CarsBrandsEntity {
    return {
      brands_id: car.brands_id,
      brands_name: car.brands_name,
      user_id: car.user_id,
    } as CarsBrandsEntity; // Приведення до типу для коректності
  }

  public static toAllResDtoBrands(
    cars: CarsBrandsEntity[],
    total: number,
    query: ListCarsQueryReqDto,
  ): ListBrandResQueryDto {
    return {
      cars: cars.map(this.toCarData),
      total,
      ...query,
    };
  }
  // для Models
  public static toModelsrData(car: CarsModelsEntity): CarsModelsEntity {
    return {
      models_id: car.models_id,
      models_name: car.models_name,
      brands_id: car.brands_id,
      user_id: car.user_id,
    } as CarsModelsEntity;
  }

  public static toAllResDtoModels(
    cars: CarsModelsEntity[],
    total: number,
    query: ListCarsQueryReqDto,
  ): ListModelsResQueryDto {
    return {
      cars: cars.map(this.toModelsrData),
      total,
      ...query,
    };
  }

  public static toAllResDtoCars(
    entities: CarsBrandsEntity[],
    total: number,
    query: ListCarsQueryReqDto,
  ): ListCarsQueryResDto {
    const cars = entities
      .map((brand) => {
        return brand.models.map((model) => ({
          brands_id: brand.brands_id,
          brands_name: brand.brands_name,
          models_id: model.models_id,
          models_name: model.models_name,
          user_id: brand.user_id,
        }));
      })
      .flat();

    return {
      ...query,
      cars,
      total,
    };
  }
}
