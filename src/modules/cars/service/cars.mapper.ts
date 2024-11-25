import { CarsBrandsEntity } from '../../../infrastructure/postgres/entities/cars_brands.entity';
import { CarsModelsEntity } from '../../../infrastructure/postgres/entities/cars_models.entity';
import { CreateCarsResDto } from '../models/dto/res/cars.res.dto';

export class CarsMapper {
  public static toResCreateDto(
    models: CarsModelsEntity,
    brands: CarsBrandsEntity,
  ): CreateCarsResDto {
    return {
      id: models.id,
      brands_id: models.brands_id,
      brands_name: brands.brands_name,
      models_name: models.models_name,
      user_Id: models.user_id,
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
