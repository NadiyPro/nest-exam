import { Module } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module';
import { FileStorageModule } from '../file-storage/file-storage.module';
import { UsersModule } from '../users/users.module';
import { CarsController } from './cars.controller';
import { CarsService } from './service/cars.service';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    FileStorageModule,
  ],
  controllers: [CarsController],
  providers: [CarsService],
  exports: [CarsService],
})
export class CarsModule {}
