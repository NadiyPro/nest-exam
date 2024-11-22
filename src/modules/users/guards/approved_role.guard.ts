import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { RoleTypeEnum } from '../enums/RoleType.enum';

@Injectable()
export class ApprovedRoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    // дістаємо дані із запиту

    if (!user) {
      throw new ForbiddenException('User is not authenticated');
    }

    // Виклик специфічної логіки перевірки ролей (наприклад, для менеджера)
    return user;
  }

  public static async approvedNotSeller(user: any): Promise<boolean> {
    if (user.role === RoleTypeEnum.BUYER) {
      throw new ForbiddenException('No role to access');
    }
    return true; // Дозволити доступ для інших ролей
  }

  public static async approvedAdminMg(user: any): Promise<boolean> {
    if (![RoleTypeEnum.ADMIN, RoleTypeEnum.MANAGER].includes(user.role)) {
      throw new ForbiddenException('No role to access');
    }
    return true;
  }

  public static async approvedAdmin(user: any): Promise<boolean> {
    if (user.role !== RoleTypeEnum.ADMIN) {
      throw new ForbiddenException('No role to access');
    }
    return true;
  }

  public static async approvedManager(user: any): Promise<boolean> {
    if (user.role !== RoleTypeEnum.MANAGER) {
      throw new ForbiddenException('No role to access');
    }
    return true;
  }

  public static async approvedDealership(user: any): Promise<boolean> {
    if (user.role !== RoleTypeEnum.DEALERSHIP) {
      throw new ForbiddenException('No role to access');
    }
    return true;
  }
}
// import {
//   ExecutionContext,
//   ForbiddenException,
//   Injectable,
// } from '@nestjs/common';
// import { Reflector } from '@nestjs/core';
//
// import { RoleTypeEnum } from '../enums/RoleType.enum';
//
// @Injectable()
// export class ApprovedRoleGuard {
//   constructor(private reflector: Reflector) {}
//
//   public static async approvedNotSeller(
//     context: ExecutionContext,
//   ): Promise<boolean> {
//     const request = context.switchToHttp().getRequest();
//     const user = request.user;
//
//     if (!user) {
//       throw new ForbiddenException('User is not authenticated');
//     }
//
//     if (user.role === RoleTypeEnum.BUYER) {
//       throw new ForbiddenException('No role to access');
//     }
//     return true; // Дозволити доступ для інших ролей
//   } // доступно всім окрім ролі покупець
//
//   public static async approvedAdminMg(
//     context: ExecutionContext,
//   ): Promise<boolean> {
//     const request = context.switchToHttp().getRequest();
//     const user = request.user;
//
//     if (!user) {
//       throw new ForbiddenException('User is not authenticated');
//     }
//
//     if (![RoleTypeEnum.ADMIN, RoleTypeEnum.MANAGER].includes(user.role)) {
//       throw new ForbiddenException('No role to access');
//     }
//
//     return true;
//   } // доступно менеджеру та адміну
//
//   public static async approvedAdmin(
//     context: ExecutionContext,
//   ): Promise<boolean> {
//     const request = context.switchToHttp().getRequest();
//     const user = request.user;
//
//     if (!user) {
//       throw new ForbiddenException('User is not authenticated');
//     }
//
//     if (user.role !== RoleTypeEnum.ADMIN) {
//       throw new ForbiddenException('No role to access');
//     }
//
//     return true;
//   } // доступно лише адміну
//
//   public static async approvedManager(
//     context: ExecutionContext,
//   ): Promise<boolean> {
//     const request = context.switchToHttp().getRequest();
//     const user = request.user;
//
//     if (!user) {
//       throw new ForbiddenException('User is not authenticated');
//     }
//
//     if (user.role !== RoleTypeEnum.MANAGER) {
//       throw new ForbiddenException('No role to access');
//     }
//
//     return true;
//   } // доступно лише менеджеру
//
//   public static async approvedDealership(
//     context: ExecutionContext,
//   ): Promise<boolean> {
//     const request = context.switchToHttp().getRequest();
//     const user = request.user;
//
//     if (!user) {
//       throw new ForbiddenException('User is not authenticated');
//     }
//
//     if (user.role !== RoleTypeEnum.DEALERSHIP) {
//       throw new ForbiddenException('No role to access');
//     }
//
//     return true;
//   } // доступно лише автосалонам
// }
