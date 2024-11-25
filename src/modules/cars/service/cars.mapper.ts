import { CarsBrandsEntity } from '../../../infrastructure/postgres/entities/cars_brands.entity';
import { CarsModelsEntity } from '../../../infrastructure/postgres/entities/cars_models.entity';
import { ListCarsQueryReqDto } from '../models/dto/req/list-cars-query.req.dto';
import { CarsResDto } from '../models/dto/res/cars.res.dto';
import { ListBrandResQueryDto } from '../models/dto/res/list-cars-query.res.dto';

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
