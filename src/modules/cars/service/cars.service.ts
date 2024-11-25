import {
  ConflictException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';

import { UserEntity } from '../../../infrastructure/postgres/entities/user.entity';
import { RefreshTokenRepository } from '../../../infrastructure/repository/services/refresh-token.repository';
import { IUserData } from '../../auth/models/interfaces/user_data.interface';
import { RoleTypeEnum } from '../enums/RoleType.enum';
import { ListUsersQueryReqDto } from '../models/dto/req/list-users-query.req.dto';
import { UpdateUserReqDto } from '../models/dto/req/update_user.req.dto';
import { CarsRepository } from '../../../infrastructure/repository/services/cars.repository';

@Injectable()
export class CarsService {
  constructor(
    // private readonly configService: ConfigService<Config>,
    private readonly carsRepository: CarsRepository,
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
    await this.userRepository.update(
      { id: userId },
      { deleted: new Date() },
    );
    await this.refreshTokenRepository.delete({ user_id: userId });
  }
}
