import { UserEntity } from '../../../infrastructure/postgres/entities/user.entity';
import { IJwtPayload } from '../../auth/models/interfaces/jwt_payload.interface';
import { IUserData } from '../../auth/models/interfaces/user_data.interface';
import { ListUsersQueryReqDto } from '../models/dto/req/list-users-query.req.dto';
import { ListResQueryDto } from '../models/dto/res/list-users-query.res.dto';
import { UserResDto } from '../models/dto/res/user.res.dto';

export class UserMapper {
  public static toResDto(user: UserEntity): UserResDto {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      avatar: `${user.avatar}`,
      accountType: user.accountType,
      role: user.role,
      deleted: user.deleted,
    };
  }

  public static toIUserData(
    user: UserEntity,
    jwtPayload: IJwtPayload,
  ): IUserData {
    return {
      userId: user.id,
      deviceId: jwtPayload.deviceId,
      email: user.email,
      accountType: user.accountType,
      role: user.role,
      deleted: user.deleted,
    };
  }

  public static toAllResDtoList(
    users: UserEntity[],
    total: number,
    query: ListUsersQueryReqDto,
  ): ListResQueryDto {
    return { users: users.map(this.toResDto), total, ...query };
  }
  // кількість юзерів, поля query передані в моделі (limit, offset, search)
}
