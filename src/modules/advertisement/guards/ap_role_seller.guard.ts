import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { AvertisementRepository } from '../../../infrastructure/repository/services/advertisement.repository';
import { AccountTypeEnum } from '../../auth/enums/AccountType.enum';
import { RoleTypeEnum } from '../../users/enums/RoleType.enum';

@Injectable()
export class ApprovedRoleGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly avertisementRepository: AvertisementRepository,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const rolesSeller = this.reflector.get<RoleTypeEnum[]>(
      'rolesSeller',
      context.getHandler(),
    );
    if (!rolesSeller) return true;

    const request = context.switchToHttp().getRequest();
    const user = request.res.locals.user;

    if (!user) {
      console.error('User not found in request');
      return false;
    }

    const isSeller = user.role === RoleTypeEnum.SELLER;
    const isBasicAccount = user.accountType === AccountTypeEnum.BASIC;

    // Якщо користувач — продавець із базовим акаунтом, перевіряємо кількість оголошень
    if (isSeller && isBasicAccount) {
      const advertisementCount = await this.avertisementRepository.findCount(
        user.id,
      );
      if (advertisementCount >= 1) {
        throw new ForbiddenException(
          'A seller with a basic account type can place only one avertisement, ' +
            'to place more avertisements on the site you can purchase a premium account.',
        );
      }
    }

    // Якщо роль користувача не SELLER, пропускаємо перевірку акаунту
    if (!isSeller || rolesSeller.includes(user.role)) {
      return true;
    }

    return false;
  }
}
