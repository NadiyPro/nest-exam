import { SetMetadata } from '@nestjs/common';

import { RoleTypeEnum } from '../../../users/enums/RoleType.enum';

export const RoleCount = (rolesSeller: RoleTypeEnum[]) =>
  SetMetadata('rolesSeller', rolesSeller);
