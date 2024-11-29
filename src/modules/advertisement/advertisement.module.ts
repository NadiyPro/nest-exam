import { Module } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module';
import { EmailModule } from '../email/email.module';
import { FileStorageModule } from '../file-storage/file-storage.module';
import { UsersModule } from '../users/users.module';
import { AvertisementController } from './advertisement.controller';
import { AdvertisementJSONService } from './advertisementJSON/service/advertisementJSON.service';
import { AdvertisementService } from './service/advertisement.service';
import { CarsModule } from '../cars/cars.module';

@Module({
  imports: [UsersModule, AuthModule, FileStorageModule, EmailModule, CarsModule],
  controllers: [AvertisementController],
  providers: [AdvertisementService, AdvertisementJSONService],
  exports: [AdvertisementService, AdvertisementJSONService],
})
export class AvertisementModule {}
