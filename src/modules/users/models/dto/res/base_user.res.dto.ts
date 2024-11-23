import { RoleTypeEnum } from '../../../enums/RoleType.enum';

export class BaseResDto {
  id: string;
  name: string;
  email: string;
  phone: string;
  accountType: string;
  role: RoleTypeEnum;
  dealership?: string;
  avatar?: string;
}
