import { Module } from '@nestjs/common';

import { FileAvatarService } from './services/file-avatar.service';
import { FileImageCarsService } from './services/file-image-cars.service';

@Module({
  imports: [],
  controllers: [],
  providers: [FileAvatarService, FileImageCarsService],
  exports: [FileAvatarService, FileImageCarsService],
})
export class FileStorageModule {}
