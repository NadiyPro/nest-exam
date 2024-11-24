import { Module } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module';
import { FileStorageModule } from '../file-storage/file-storage.module';
import { UsersModule } from '../users/users.module';
import { CarsController } from './cars.controller';

@Module({
  imports: [
    // forwardRef(() => AdvertisementModule),
    AuthModule,
    UsersModule,
   FileStorageModule,
  ],
  // імпортуємо інший модуль (ArticlesModule) з використанням функції forwardRef.
  // forwardRef дозволяє сказати NestJS: "Ми знаємо, що модулі залежать один від одного,
  // але спочатку підключи один з них, а потім повернись до другого".
  // Це розриває циклічну залежність.
  controllers: [CarsController],
  providers: [CarsService],
  exports: [CarsService],
  // ставимо на експорт, оскільки даний сервіс ми використовуємо ще в ArticlesService
})
export class CarsModule {}
