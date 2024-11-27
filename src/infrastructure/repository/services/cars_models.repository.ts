import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { ListCarsQueryReqDto } from '../../../modules/cars/models/dto/req/list-cars-query.req.dto';
import { CarsModelsEntity } from '../../postgres/entities/cars_models.entity';

@Injectable()
export class CarsModelsRepository extends Repository<CarsModelsEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(CarsModelsEntity, dataSource.manager);
  }
  public async findAllModels(
    query: ListCarsQueryReqDto,
  ): Promise<[CarsModelsEntity[], number]> {
    const qb = this.createQueryBuilder('cars_models');
    qb.take(query.limit);
    qb.skip(query.offset);

    if (query.search) {
      qb.andWhere('cars_models.models_name ILIKE :search');
      qb.setParameter('search', `%${query.search}%`);
    }

    qb.orderBy('models_name', 'ASC');
    return await qb.getManyAndCount();
  }
}
