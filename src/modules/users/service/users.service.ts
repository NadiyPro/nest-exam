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
import { UpdateUserReqDto } from '../models/dto/req/update_user.req.dto';

@Injectable()
export class UsersService {
  constructor(
    // private readonly configService: ConfigService<Config>,
    private readonly fileStorageService: FileStorageService,
    private readonly userRepository: UserRepository,
    private readonly refreshTokenRepository: RefreshTokenRepository,
  ) {}

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
    if (userData.role === RoleTypeEnum.BUYER) {
      throw new ForbiddenException('No role to access');
    }
    const user = await this.userRepository.findOneBy({ id: userData.userId });
    // шукаємо користувача в БД за userId
    this.userRepository.merge(user, dto);
    // метод merge об’єднує нові дані з dto з поточними даними user.
    return await this.userRepository.save(user);
    // Після об’єднання даних оновлений user зберігається в БД за допомогою save
  }

  public async removeMe(userData: IUserData): Promise<void> {
    // userData містить дані користувача, який хоче "видалити" свій обліковий запис
    if (userData.role === RoleTypeEnum.BUYER) {
      throw new ForbiddenException('No role to access');
    }
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
    if (userData.role === RoleTypeEnum.BUYER) {
      throw new ForbiddenException('No role to access');
    }
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
    await this.userRepository.save({ ...user, avatar: pathToFile });
    // зберігаємо оновлену інформацію по юзеру вже з аватаром у БД табл юзерів
    // тобто, при збережені старий аватар перетирається на новий
  }

  public async deleteAvatar(userData: IUserData): Promise<void> {
    if (userData.role === RoleTypeEnum.BUYER) {
      throw new ForbiddenException('No role to access');
    }
    const user = await this.userRepository.findOneBy({ id: userData.userId });
    // шукаємо юзера по id в БД юзерів
    if (user.avatar) {
      await this.fileStorageService.deleteFile(user.avatar);
      await this.userRepository.save({ ...user, avatar: null });
    } // якщо у юзера є аватар, то ми його видаляємо
    // і зберігаємо юзера з імеджом "null"
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
}
