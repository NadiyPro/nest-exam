import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { ListAdQueryReqDto } from '../../../modules/advertisement/models/dto/req/list-advertisement_query.req.dto';
import { AdvertisementEntity } from '../../postgres/entities/advertisement.entity';

@Injectable()
export class AvertisementRepository extends Repository<AdvertisementEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(AdvertisementEntity, dataSource.manager);
  }

  public async findAdvertisementAll(
    query: ListAdQueryReqDto,
  ): Promise<[AdvertisementEntity[], number]> {
    const qb = this.createQueryBuilder('advertisement')
      .take(query.limit)
      .skip(query.offset);

    if (query.search) {
      qb.andWhere(
        '(advertisement.brands_name ILIKE :search OR ' +
          'advertisement.models_name ILIKE :search OR ' +
          'advertisement.name ILIKE :search)',
        { search: `%${query.search}%` },
      );
    }

    qb.orderBy('advertisement.brands_name', 'ASC');
    return await qb.getManyAndCount();
  }
}
