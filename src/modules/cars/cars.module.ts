import { Module } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module';
import { EmailModule } from '../email/email.module';
import { FileStorageModule } from '../file-storage/file-storage.module';
import { UsersModule } from '../users/users.module';
import { CarsController } from './cars.controller';
import { CarsJSONService } from './carsJSON/service/carsJSON.service';
import { CarsService } from './service/cars.service';
import { AvertisementModule } from '../advertisement/advertisement.module';

@Module({
  imports: [AuthModule, UsersModule, FileStorageModule, EmailModule],
  controllers: [CarsController],
  providers: [CarsService, CarsJSONService],
  exports: [CarsService, CarsJSONService],
})
export class CarsModule {}
