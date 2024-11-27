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
import { FileStorageService } from '../../file-storage/services/file-storage.service';
import { RoleTypeEnum } from '../enums/RoleType.enum';
import { ListUsersQueryReqDto } from '../models/dto/req/list-users-query.req.dto';
import { UpdateUserReqDto } from '../models/dto/req/update_user.req.dto';

@Injectable()
export class UsersService {
  constructor(
    // private readonly configService: ConfigService<Config>,
    private readonly fileStorageService: FileStorageService,
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
      // якщо користувач менеджером, то перевіряємо через includes,
      // чи запитана ним роль на видачу є SELLER або BUYER
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
    // шукаємо користувача в БД за userId
    this.userRepository.merge(user, dto);
    // метод merge об’єднує нові дані з dto з поточними даними user.
    return await this.userRepository.save(user);
    // Після об’єднання даних оновлений user зберігається в БД за допомогою save
  }

  public async removeMe(userData: IUserData): Promise<void> {
    // userData містить дані користувача, який хоче "видалити" свій обліковий запис
    await this.userRepository.update(
      { id: userData.userId },
      // шукає запис користувача за ідентифікатором userData.userId
      { deleted: new Date() },
      // встановлює поточну дату та час у поле deleted. Це мітка про "видалення",
      // яка позначає, коли обліковий запис був "видалений".
      // Це не фізичне видалення, а скоріше позначка,
      // що користувач неактивний або "видалений".
      // Вся інформація про користувача залишається в базі, і її можна легко відновити.
    );
    await this.refreshTokenRepository.delete({ user_id: userData.userId });
    // видаляє всі токени оновлення (refresh tokens), пов'язані з користувачем
  }

  public async uploadAvatar(
    userData: IUserData,
    file: Express.Multer.File,
  ): Promise<void> {
    const user = await this.userRepository.findOneBy({ id: userData.userId });
    const pathToFile = await this.fileStorageService.uploadFile(
      file,
      ContentType.AVATAR,
      userData.userId,
    ); // завантажуємо аватар для юзера під зазначеним id
    if (user.avatar) {
      await this.fileStorageService.deleteFile(user.avatar);
    } // якщо у юзера вже є якась картинка (аватор), то ми його видаляємо
    // тобто видаляємо попередню картинку, а замість неї завантажуємо якусь нову
    console.log(user.avatar);
    await this.userRepository.save({ ...user, avatar: pathToFile });
    // зберігаємо оновлену інформацію по юзеру вже з аватаром у БД табл юзерів
    // тобто, при збережені старий аватар перетирається на новий
  }

  public async deleteAvatar(userData: IUserData): Promise<void> {
    const user = await this.userRepository.findOneBy({ id: userData.userId });
    // шукаємо юзера по id в БД юзерів
    if (user.avatar) {
      await this.fileStorageService.deleteFile(user.avatar);
      await this.userRepository.save({ ...user, avatar: null });
    }
  }
  // public async findAllManager(): Promise<UserEntity[]> {
  //   const users = await this.userRepository.find({
  //     where: { role: RoleTypeEnum.MANAGER },
  //   });
  //   return users; // Повертаємо масив користувачів
  // }
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
  } // перевіряє, чи існує користувач із зазначеним userId у базі даних.
  // Якщо користувача не знайдено, метод викидає виняток ConflictException із повідомленням

  public async findAll(
    query: ListUsersQueryReqDto,
  ): Promise<[UserEntity[], number]> {
    return await this.userRepository.findAll(query);
  }

  public async deleteId(userId: string): Promise<void> {
    // userData містить дані користувача, який хоче "видалити" свій обліковий запис
    await this.userRepository.update(
      { id: userId },
      // шукає запис користувача за ідентифікатором userData.userId
      { deleted: new Date() },
      // встановлює поточну дату та час у поле deleted. Це мітка про "видалення",
      // яка позначає, коли обліковий запис був "видалений".
      // Це не фізичне видалення, а скоріше позначка,
      // що користувач неактивний або "видалений".
      // Вся інформація про користувача залишається в базі, і її можна легко відновити.
    );
    await this.refreshTokenRepository.delete({ user_id: userId });
    // видаляє всі токени оновлення (refresh tokens), пов'язані з користувачем
  }
}
