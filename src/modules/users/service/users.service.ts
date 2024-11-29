import {
  ConflictException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';

import { UserEntity } from '../../../infrastructure/postgres/entities/user.entity';
import { RefreshTokenRepository } from '../../../infrastructure/repository/services/refresh-token.repository';
import { UserRepository } from '../../../infrastructure/repository/services/user.repository';
import { IUserData } from '../../auth/models/interfaces/user_data.interface';
import { ContentType } from '../../file-storage/enums/file-type.enum';
import { FileAvatarService } from '../../file-storage/services/file-avatar.service';
import { RoleTypeEnum } from '../enums/RoleType.enum';
import { ListUsersQueryReqDto } from '../models/dto/req/list-users-query.req.dto';
import { UpdateUserReqDto } from '../models/dto/req/update_user.req.dto';

@Injectable()
export class UsersService {
  constructor(
    // private readonly configService: ConfigService<Config>,
    private readonly fileAvatarService: FileAvatarService,
    private readonly userRepository: UserRepository,
    private readonly refreshTokenRepository: RefreshTokenRepository,
  ) {}

  public async giveRole(
    user_id: string,
    new_role: RoleTypeEnum,
    role: RoleTypeEnum,
  ): Promise<UserEntity> {
    if (
      role === RoleTypeEnum.ADMIN ||
      (role === RoleTypeEnum.MANAGER &&
        [RoleTypeEnum.SELLER, RoleTypeEnum.BUYER].includes(new_role))
    ) {
      const user = await this.userRepository.giveRole(user_id, new_role);
      return await this.userRepository.save(user);
    } else {
      throw new Error('Permission denied');
    }
  }

  public async findMe(userData: IUserData): Promise<UserEntity> {
    if (userData.role === RoleTypeEnum.BUYER) {
      throw new ForbiddenException('No role to access');
    }
    return await this.userRepository.findOneBy({ id: userData.userId });
  }

  public async updateMe(
    userData: IUserData,
    dto: UpdateUserReqDto,
  ): Promise<UserEntity> {
    const user = await this.userRepository.findOneBy({ id: userData.userId });
    this.userRepository.merge(user, dto);
    return await this.userRepository.save(user);
  }

  public async removeMe(userData: IUserData): Promise<void> {
    await this.userRepository.update(
      { id: userData.userId },
      { deleted: new Date() },
    );
    await this.refreshTokenRepository.delete({ user_id: userData.userId });
  }

  public async uploadAvatar(
    userData: IUserData,
    file: Express.Multer.File,
  ): Promise<void> {
    const user = await this.userRepository.findOneBy({ id: userData.userId });
    const pathToFile = await this.fileAvatarService.uploadFile(
      file,
      ContentType.AVATAR,
      userData.userId,
    );
    if (user.avatar) {
      await this.fileAvatarService.deleteFile(user.avatar);
    }
    console.log(user.avatar);
    await this.userRepository.save({ ...user, avatar: pathToFile });
  }

  public async deleteAvatar(userData: IUserData): Promise<void> {
    const user = await this.userRepository.findOneBy({ id: userData.userId });
    if (user.avatar) {
      await this.fileAvatarService.deleteFile(user.avatar);
      await this.userRepository.save({ ...user, avatar: null });
    }
  }
  public async findAllManager(): Promise<UserEntity[]> {
    return await this.userRepository.findAllManager();
  }

  public async findOne(userId: string): Promise<UserEntity> {
    await this.isUserExistOrThrow(userId);
    return await this.userRepository.findOneBy({ id: userId });
  }

  private async isUserExistOrThrow(userId: string): Promise<void> {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new ConflictException('User not found');
    }
  }

  public async findAll(
    query: ListUsersQueryReqDto,
  ): Promise<[UserEntity[], number]> {
    return await this.userRepository.findAll(query);
  }

  public async deleteId(userId: string): Promise<string> {
    await this.userRepository.update({ id: userId }, { deleted: new Date() });
    await this.refreshTokenRepository.delete({ user_id: userId });
    return 'The user in the table (db) has been successfully marked as deleted';
  }
}
