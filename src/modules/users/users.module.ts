import { forwardRef, Module } from '@nestjs/common';

import { AdvertisementModule } from '../advertisement/advertisement.module';
import { AuthModule } from '../auth/auth.module';
import { FileStorageModule } from '../file-storage/file-storage.module';
import { UsersService } from './services/users.service';
import { UsersController } from './users.controller';

@Module({
  imports: [
    forwardRef(() => AdvertisementModule),
    AuthModule,
    FileStorageModule,
  ],
  // імпортуємо інший модуль (ArticlesModule) з використанням функції forwardRef.
  // forwardRef дозволяє сказати NestJS: "Ми знаємо, що модулі залежать один від одного,
  // але спочатку підключи один з них, а потім повернись до другого".
  // Це розриває циклічну залежність.
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
  // ставимо на експорт, оскільки даний сервіс ми використовуємо ще в ArticlesService
})
export class UsersModule {}
