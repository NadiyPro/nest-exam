import { CarsBrandsEntity } from '../../../infrastructure/postgres/entities/cars_brands.entity';
import { CarsModelsEntity } from '../../../infrastructure/postgres/entities/cars_models.entity';
import { ListCarsQueryReqDto } from '../models/dto/req/list-cars-query.req.dto';
import { CarsResDto } from '../models/dto/res/cars.res.dto';
import { ListBrandResQueryDto } from '../models/dto/res/list-brand-query.res.dto';
import { ListCarsQueryResDto } from '../models/dto/res/list-cars-query.res.dto';
import { ListModelsResQueryDto } from '../models/dto/res/list-models-query.res.dto';

export class CarsMapper {
  public static toResCreateDto(
    models: CarsModelsEntity,
    brands: CarsBrandsEntity,
  ): CarsResDto {
    return {
      id: models.id,
      brands_id: models.brands_id,
      brands_name: brands.brands_name,
      models_name: models.models_name,
      user_id: models.user_id,
    };
  }
  // для Brands
  public static toCarData(car: CarsBrandsEntity): CarsBrandsEntity {
    return {
      id: car.id,
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
      id: car.id,
      models_name: car.models_name,
      brands_id: car.brands_id, // Виправлено
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
          id: model.id,
          brands_id: brand.id,
          brands_name: brand.brands_name,
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
  // public static toAllResDto(entities: CarsBrandsEntity[]): CarsResDto[] {
  //   return entities.map((entity) => ({
  //     id: entity.id,
  //     brands_id: entity.id,
  //     brands_name: entity.brands_name,
  //     models_name: entity.models.map((model) => model.models_name).join(', '),
  //     user_id: entity.user_id,
  //   }));
  // }
  //
  // public static toAllResDtoCars(
  //   entities: CarsBrandsEntity[],
  //   total: number,
  //   query: ListCarsQueryReqDto,
  // ): ListCarsQueryResDto {
  //   const cars = this.toAllResDto(entities);
  //   return {
  //     ...query,
  //     cars,
  //     total,
  //   };
  // }
}

//
// public static toIUserData(
//   user: UserEntity,
//   jwtPayload: IJwtPayload,
// ): IUserData {
//   return {
//     userId: user.id,
//     deviceId: jwtPayload.deviceId,
//     email: user.email,
//     accountType: user.accountType,
//     role: user.role,
//   };
// }
//
// public static toAllResDtoList(
//   users: UserEntity[],
//   total: number,
//   query: ListUsersQueryReqDto,
// ): ListResQueryDto {
//   return { users: users.map(this.toResDto), total, ...query };
// }
// кількість юзерів, поля query передані в моделі (limit, offset, search)
