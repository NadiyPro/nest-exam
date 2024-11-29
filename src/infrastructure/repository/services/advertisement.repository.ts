import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { AdvertisementEntity } from '../../postgres/entities/advertisement.entity';

@Injectable()
export class AvertisementRepository extends Repository<AdvertisementEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(AdvertisementEntity, dataSource.manager);
  }
}
