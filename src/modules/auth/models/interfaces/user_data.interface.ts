import { RoleTypeEnum } from '../../../users/enums/RoleType.enum';
import { AccountTypeEnum } from '../../enums/AccountType.enum';

export interface IUserData {
  userId: string;
  deviceId: string;
  email: string;
  accountType: AccountTypeEnum;
  role: RoleTypeEnum;
  dealership?: string;
  deleted: Date | null;
}
