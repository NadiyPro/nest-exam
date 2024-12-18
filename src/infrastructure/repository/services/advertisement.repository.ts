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
      .leftJoinAndSelect('advertisement.advertisement_cars', 'carsModel')
      .leftJoinAndSelect('carsModel.cars_brands_models', 'brand')
      .take(query.limit)
      .skip(query.offset);

    if (query.search) {
      qb.andWhere(
        '(brand.brands_name ILIKE :search OR ' +
          'carsModel.models_name ILIKE :search OR ' +
          'advertisement.text_advertisement ILIKE :search)',
        { search: `%${query.search}%` },
      );
    }

    qb.orderBy('brand.brands_name', 'ASC');
    return await qb.getManyAndCount();
  }

  public async findCount(userId: string) {
    const qb = this.createQueryBuilder('advertisement');
    await qb.where('advertisement.user_id = :userId', { userId });
    return await qb.getCount();
  }
}
