// import {
//   CanActivate,
//   ExecutionContext,
//   ForbiddenException,
//   Injectable,
// } from '@nestjs/common';
// import { Reflector } from '@nestjs/core';
//
// import { RoleTypeEnum } from '../users/enums/RoleType.enum';
//
// @Injectable()
// export class ApprovedRoleGuard implements CanActivate {
//   constructor(private reflector: Reflector) {}
//
//   public async canActivate(context: ExecutionContext): Promise<boolean> {
//     const request = context.switchToHttp().getRequest();
//     const user = request.user;
//     // дістаємо дані із запиту
//
//     if (!user) {
//       throw new ForbiddenException('User is not authenticated');
//     }
//
//     // Виклик специфічної логіки перевірки ролей (наприклад, для менеджера)
//     return user;
//   }
//
//   public static async approvedNotSeller(user: any): Promise<boolean> {
//     if (user.role === RoleTypeEnum.BUYER) {
//       throw new ForbiddenException('No role to access');
//     }
//     return true; // Дозволити доступ для інших ролей
//   }
//
//   public static async approvedAdminMg(user: any): Promise<boolean> {
//     if (![RoleTypeEnum.ADMIN, RoleTypeEnum.MANAGER].includes(user.role)) {
//       throw new ForbiddenException('No role to access');
//     }
//     return true;
//   }
//
//   public static async approvedAdmin(user: any): Promise<boolean> {
//     if (user.role !== RoleTypeEnum.ADMIN) {
//       throw new ForbiddenException('No role to access');
//     }
//     return true;
//   }
//
//   public static async approvedManager(user: any): Promise<boolean> {
//     if (user.role !== RoleTypeEnum.MANAGER) {
//       throw new ForbiddenException('No role to access');
//     }
//     return true;
//   }
//
//   public static async approvedDealership(user: any): Promise<boolean> {
//     if (user.role !== RoleTypeEnum.DEALERSHIP) {
//       throw new ForbiddenException('No role to access');
//     }
//     return true;
//   }
// }
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { RoleTypeEnum } from '../users/enums/RoleType.enum';

@Injectable()
export class ApprovedRoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<RoleTypeEnum[]>(
      'roles',
      context.getHandler(),
    );
    if (!roles) return true;

    const request = context.switchToHttp().getRequest();
    console.log('Request user:', request.user); // Лог для перевірки

    const user = request.res.locals.user;

    if (!user) {
      console.error('User not found in request');
      return false;
    }
    return roles.includes(user.role);
  }
}
