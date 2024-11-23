import { AccountTypeEnum } from '../../../users/enums/AccountType.enum';
import { RoleTypeEnum } from '../../../users/enums/RoleType.enum';

export interface IUserData {
  userId: string;
  deviceId: string;
  email: string;
  accountType: AccountTypeEnum;
  role: RoleTypeEnum;
  dealership?: string;
}
