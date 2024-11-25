import { ConflictException, Injectable } from '@nestjs/common';

import { CarsBrandsEntity } from '../../../infrastructure/postgres/entities/cars_brands.entity';
import { CarsModelsEntity } from '../../../infrastructure/postgres/entities/cars_models.entity';
import { CarsBrandsRepository } from '../../../infrastructure/repository/services/cars_brands.repository';
import { CarsModelsRepository } from '../../../infrastructure/repository/services/cars_models.repository';
import { IUserData } from '../../auth/models/interfaces/user_data.interface';
import { CreateCarsReqDto } from '../models/dto/req/create_cars.req.dto';
import { ListCarsQueryReqDto } from '../models/dto/req/list-cars-query.req.dto';
import { CarsResDto } from '../models/dto/res/cars.res.dto';
import { CarsMapper } from './cars.mapper';

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
  ): Promise<CarsResDto> {
    const cars_brands = await this.carsBrandsRepository.findOneBy({
      brands_name: dto.brands_name,
    });
    if (cars_brands) {
      throw new ConflictException('The brand already exists');
    }
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

  public async findAllBrands(
    query: ListCarsQueryReqDto,
  ): Promise<[CarsBrandsEntity[], number]> {
    return await this.carsBrandsRepository.findAllBrands(query);
  }

  public async findAllModel(
    query: ListCarsQueryReqDto,
  ): Promise<[CarsModelsEntity[], number]> {
    return await this.carsModelsRepository.findAllModels(query);
  }

  public async findAllCars(
    query: ListCarsQueryReqDto,
  ): Promise<[CarsBrandsEntity[], number]> {
    const [entities, total] =
      await this.carsBrandsRepository.findAllCars(query);

    // Повертаємо масив CarsBrandsEntity та кількість
    return [entities, total];
  }
  // public async findAllCars(
  //   query: ListCarsQueryReqDto,
  // ): Promise<[CarsResDto[], number]> {
  //   return await this.carsBrandsRepository.findAllCars(query);
  // }
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
//
// public async deleteId(userId: string): Promise<void> {
//   await this.userRepository.update({ id: userId }, { deleted: new Date() });
//   await this.refreshTokenRepository.delete({ user_id: userId });
// }
