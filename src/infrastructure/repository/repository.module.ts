import { Global, Module } from '@nestjs/common';

import { AvertisementRepository } from './services/advertisement.repository';
import { CarsBrandsRepository } from './services/cars_brands.repository';
import { CarsModelsRepository } from './services/cars_models.repository';
import { RefreshTokenRepository } from './services/refresh-token.repository';
import { UserRepository } from './services/user.repository';

const repositories = [
  RefreshTokenRepository,
  UserRepository,
  CarsBrandsRepository,
  CarsModelsRepository,
  AvertisementRepository,
];

@Global()
@Module({
  providers: [...repositories],
  exports: [...repositories],
  // Список провайдерів, які будуть доступні за межами цього модуля.
  // Оскільки модуль глобальний,
  // ці сервіси зможуть використовуватися в будь-якому іншому модулі
})
export class RepositoryModule {}
