import { ConflictException, Injectable } from '@nestjs/common';

import { CarsModelsEntity } from '../../../infrastructure/postgres/entities/cars_models.entity';
import { CarsBrandsRepository } from '../../../infrastructure/repository/services/cars_brands.repository';
import { CarsModelsRepository } from '../../../infrastructure/repository/services/cars_models.repository';
import { UserRepository } from '../../../infrastructure/repository/services/user.repository';
// import { RefreshTokenRepository } from '../../../infrastructure/repository/services/refresh-token.repository';
import { IUserData } from '../../auth/models/interfaces/user_data.interface';
import { CreateCarsReqDto } from '../models/dto/req/create_cars.req.dto';
import { CarsMapper } from './cars.mapper';
import { CreateCarsResDto } from '../models/dto/res/cars.res.dto';

@Injectable()
export class CarsService {
  constructor(
    private readonly carsBrandsRepository: CarsBrandsRepository,
    private readonly carsModelsRepository: CarsModelsRepository,
    // private readonly refreshTokenRepository: RefreshTokenRepository,
  ) {}

  public async createCars(
    userData: IUserData,
    dto: CreateCarsReqDto,
  ): Promise<CreateCarsResDto> {
    // const brand = await this.createTags(dto.tags);
    const cars_brands = await this.carsBrandsRepository.findOneBy({
      brands_name: dto.brands_name,
    });
    if (cars_brands) {
      throw new ConflictException('The brand already exists');
    } // перевіряємо чи лайкав юзер вже цей пост
    // якщо юзер вже лайкав, цей пост, то видамо помилку
    // (бо юзер може поставити лише один лайк на пост)
    const new_brand = await this.carsBrandsRepository.save(
      this.carsBrandsRepository.create({
        brands_name: dto.brands_name,
        user_id: userData.userId,
      }),
    );

    const new_model = await this.carsModelsRepository.save(
      this.carsModelsRepository.create({
        models_name: dto.models_name,
        brands_id: new_brand.id,
        user_id: userData.userId,
      }),
    );
    return CarsMapper.toResCreateDto(new_model, new_brand);
  }
}
// public async findMe(userData: IUserData): Promise<UserEntity> {
//   if (userData.role === RoleTypeEnum.BUYER) {
//     throw new ForbiddenException('No role to access');
//   }
//   return await this.carsRepository.findOneBy({ id: userData.userId });
// }
//
// public async updateMe(
//   userData: IUserData,
//   dto: UpdateUserReqDto,
// ): Promise<UserEntity> {
//   const user = await this.userRepository.findOneBy({ id: userData.userId });
//   // шукаємо користувача в БД за userId
//   this.userRepository.merge(user, dto);
//   // метод merge об’єднує нові дані з dto з поточними даними user.
//   return await this.userRepository.save(user);
//   // Після об’єднання даних оновлений user зберігається в БД за допомогою save
// }
//
// public async removeMe(userData: IUserData): Promise<void> {
//   // userData містить дані користувача, який хоче "видалити" свій обліковий запис
//   await this.userRepository.update(
//     { id: userData.userId },
//     // шукає запис користувача за ідентифікатором userData.userId
//     { deleted: new Date() },
//     // встановлює поточну дату та час у поле deleted. Це мітка про "видалення",
//     // яка позначає, коли обліковий запис був "видалений".
//     // Це не фізичне видалення, а скоріше позначка,
//     // що користувач неактивний або "видалений".
//     // Вся інформація про користувача залишається в базі, і її можна легко відновити.
//   );
//   await this.refreshTokenRepository.delete({ user_id: userData.userId });
//   // видаляє всі токени оновлення (refresh tokens), пов'язані з користувачем
// }
//
// public async findOne(userId: string): Promise<UserEntity> {
//   await this.isUserExistOrThrow(userId);
//   return await this.userRepository.findOneBy({ id: userId });
// }
//
// private async isUserExistOrThrow(userId: string): Promise<void> {
//   const user = await this.userRepository.findOneBy({ id: userId });
//   if (!user) {
//     throw new ConflictException('User not found');
//   }
// } // перевіряє, чи існує користувач із зазначеним userId у базі даних.
// // Якщо користувача не знайдено, метод викидає виняток ConflictException із повідомленням
//
// public async findAll(
//   query: ListUsersQueryReqDto,
// ): Promise<[UserEntity[], number]> {
//   return await this.userRepository.findAll(query);
// }
//
// public async deleteId(userId: string): Promise<void> {
//   await this.userRepository.update({ id: userId }, { deleted: new Date() });
//   await this.refreshTokenRepository.delete({ user_id: userId });
// }
