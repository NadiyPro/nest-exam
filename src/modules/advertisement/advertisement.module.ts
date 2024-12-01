import { Module } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module';
import { CarsModule } from '../cars/cars.module';
import { EmailModule } from '../email/email.module';
import { FileStorageModule } from '../file-storage/file-storage.module';
import { UsersModule } from '../users/users.module';
import { AvertisementController } from './advertisement.controller';
import { AdvertisementJSONService } from './advertisementJSON/service/advertisementJSON.service';
import { AdvertisementMapper } from './service/advertisement.mapper';
import { AdvertisementService } from './service/advertisement.service';

@Module({
  imports: [
    UsersModule,
    AuthModule,
    FileStorageModule,
    EmailModule,
    CarsModule,
  ],
  controllers: [AvertisementController],
  providers: [
    AdvertisementService,
    AdvertisementJSONService,
    AdvertisementMapper,
  ],
  exports: [
    AdvertisementService,
    AdvertisementJSONService,
    AdvertisementMapper,
  ],
})
export class AvertisementModule {}
