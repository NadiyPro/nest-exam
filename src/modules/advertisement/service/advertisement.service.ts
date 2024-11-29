import { Injectable } from '@nestjs/common';

import { UserEntity } from '../../../infrastructure/postgres/entities/user.entity';
import { RefreshTokenRepository } from '../../../infrastructure/repository/services/refresh-token.repository';
import { UserRepository } from '../../../infrastructure/repository/services/user.repository';
import { IUserData } from '../../auth/models/interfaces/user_data.interface';
import { FileStorageService } from '../../file-storage/services/file-storage.service';
import { RoleTypeEnum } from '../../users/enums/RoleType.enum';
import { ContentType } from '../../file-storage/enums/file-type.enum';

@Injectable()
export class AdvertisementService {
  constructor(
    // private readonly configService: ConfigService<Config>,
    private readonly fileStorageService: FileStorageService,
    private readonly userRepository: UserRepository,
    private readonly refreshTokenRepository: RefreshTokenRepository,
  ) {}

  public async uploadAvatar(
    userData: IUserData,
    file: Express.Multer.File,
  ): Promise<void> {
    const user = await this.userRepository.findOneBy({ id: userData.userId });
    const pathToFile = await this.fileStorageService.uploadFile(
      file,
      ContentType.AVATAR,
      userData.userId,
    );
    if (user.avatar) {
      await this.fileStorageService.deleteFile(user.avatar);
    }
    console.log(user.avatar);
    await this.userRepository.save({ ...user, avatar: pathToFile });
  }

  // public async deleteAvatar(userData: IUserData): Promise<void> {
  //   const user = await this.userRepository.findOneBy({ id: userData.userId });
  //   if (user.avatar) {
  //     await this.fileStorageService.deleteFile(user.avatar);
  //     await this.userRepository.save({ ...user, avatar: null });
  //   }
  // }
}
