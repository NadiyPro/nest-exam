import { forwardRef, Module } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module';
import { FileStorageModule } from '../file-storage/file-storage.module';
import { UsersService } from './service/users.service';
import { UsersController } from './users.controller';
import { UsersJSONService } from './usersJSON/service/usersJSON.service';

@Module({
  imports: [
    forwardRef(() => AuthModule),
    FileStorageModule,
  ],
  // імпортуємо інший модуль (ArticlesModule) з використанням функції forwardRef.
  // forwardRef дозволяє сказати NestJS: "Ми знаємо, що модулі залежать один від одного,
  // але спочатку підключи один з них, а потім повернись до другого".
  // Це розриває циклічну залежність.
  controllers: [UsersController],
  providers: [UsersService, UsersJSONService],
  exports: [UsersService, UsersJSONService],
})
export class UsersModule {}
