import { Global, Module } from '@nestjs/common';

import { CarsRepository } from './services/cars.repository';
import { RefreshTokenRepository } from './services/refresh-token.repository';
// import { RefreshTokenRepository } from './services/refresh-token.repository';
import { UserRepository } from './services/user.repository';

const repositories = [
  // ArticleRepository,
  CarsRepository,
  RefreshTokenRepository,
  UserRepository,
];

@Global()
@Module({
  providers: [...repositories],
  // Список провайдерів, доступних у цьому модулі.
  // У цьому випадку репозиторії UserRepository та ArticleRepository
  // будуть доступні як сервіси для інжектування в інші компоненти
  exports: [...repositories],
  // Список провайдерів, які будуть доступні за межами цього модуля.
  // Оскільки модуль глобальний,
  // ці сервіси зможуть використовуватися в будь-якому іншому модулі
})
export class RepositoryModule {}
