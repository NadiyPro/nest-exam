import { AccountTypeEnum } from '../../../../auth/enums/AccountType.enum';
import { RoleTypeEnum } from '../../../enums/RoleType.enum';

export class BaseResDto {
  id: string;
  name: string;
  email: string;
  phone: string;
  accountType: AccountTypeEnum;
  role: RoleTypeEnum;
  dealership?: string;
  avatar?: string;
  deleted: Date | null;
}
