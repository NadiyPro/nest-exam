import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { RoleTypeEnum } from '../enums/RoleType.enum';

// @Injectable()
// export class Approved_role {
//   public static async approved_not_seller(userData: IUserData): Promise<void> {
//     if (userData.role === RoleTypeEnum.BUYER) {
//       throw new ForbiddenException('No role to access');
//     }
//   }
// }
@Injectable()
export class ApprovedRoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  public static async approved_not_seller(
    context: ExecutionContext,
  ): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    if (user.role === RoleTypeEnum.BUYER) {
      throw new ForbiddenException('No role to access');
    }
    return true; // Дозволити доступ для інших ролей
  }

  public async approved_admin_mg(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // Перевірка на ролі BUYER або SELLER
    if (user.role === RoleTypeEnum.BUYER || user.role === RoleTypeEnum.SELLER) {
      throw new ForbiddenException('No role to access');
    }

    return true; // Дозволити доступ для інших ролей
  }
}
