import { UserEntity } from '../../../infrastructure/postgres/entities/user.entity';
import { IJwtPayload } from '../../auth/models/interfaces/jwt_payload.interface';
import { IUserData } from '../../auth/models/interfaces/user_data.interface';
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
    };
  }
}
