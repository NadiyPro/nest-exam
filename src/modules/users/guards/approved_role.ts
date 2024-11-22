import { ForbiddenException, Injectable } from '@nestjs/common';
import { IUserData } from '../../auth/models/interfaces/user_data.interface';
import { RoleTypeEnum } from '../enums/RoleType.enum';

@Injectable()
export class Approved_role{
  async aprroved_not_seller(userData: IUserData): Promise<void> {
    if (userData.role === RoleTypeEnum.BUYER) {
    throw new ForbiddenException('No role to access');
  }
};