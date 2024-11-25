import { CarsBrandsEntity } from '../../../infrastructure/postgres/entities/cars_brands.entity';

export class CarsMapper {
  public static toResDto(cars_brands: CarsBrandsEntity): UserResDto {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      avatar: `${user.avatar}`,
      accountType: user.accountType,
      role: user.role,
    };
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
}
