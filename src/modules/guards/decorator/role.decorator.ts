import { SetMetadata } from '@nestjs/common';

import { RoleTypeEnum } from '../../users/enums/RoleType.enum';

export const Role = (roles: RoleTypeEnum[]) => SetMetadata('roles', roles);
