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
