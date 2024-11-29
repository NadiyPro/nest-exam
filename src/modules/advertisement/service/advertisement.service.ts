import { Injectable } from '@nestjs/common';

import { UserEntity } from '../../../infrastructure/postgres/entities/user.entity';
import { RefreshTokenRepository } from '../../../infrastructure/repository/services/refresh-token.repository';
import { UserRepository } from '../../../infrastructure/repository/services/user.repository';
import { IUserData } from '../../auth/models/interfaces/user_data.interface';
import { FileStorageService } from '../../file-storage/services/file-storage.service';
import { RoleTypeEnum } from '../../users/enums/RoleType.enum';

@Injectable()
export class AdvertisementService {
  constructor(
    // private readonly configService: ConfigService<Config>,
    private readonly fileStorageService: FileStorageService,
    private readonly userRepository: UserRepository,
    private readonly refreshTokenRepository: RefreshTokenRepository,
  ) {}

  // public async findMe(userData: IUserData): Promise<UserEntity> {
  //   if (userData.role === RoleTypeEnum.BUYER) {
  //     throw new ForbiddenException('No role to access');
  //   }
  //   return await this.userRepository.findOneBy({ id: userData.userId });
  // }
}
