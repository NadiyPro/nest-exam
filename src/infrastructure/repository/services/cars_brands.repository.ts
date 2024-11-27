import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { ListCarsQueryReqDto } from '../../../modules/cars/models/dto/req/list-cars-query.req.dto';
import { CarsBrandsEntity } from '../../postgres/entities/cars_brands.entity';

@Injectable()
export class CarsBrandsRepository extends Repository<CarsBrandsEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(CarsBrandsEntity, dataSource.manager);
  }

  public async findAllBrands(
    query: ListCarsQueryReqDto,
  ): Promise<[CarsBrandsEntity[], number]> {
    const qb = this.createQueryBuilder('cars_brands');
    qb.take(query.limit);
    qb.skip(query.offset);

    if (query.search) {
      qb.andWhere('CONCAT(cars_brands.brands_name) ILIKE :search');
      qb.setParameter('search', `%${query.search}%`);
    }

    qb.orderBy('brands_name', 'ASC');
    return await qb.getManyAndCount();
  }

  public async findAllCars(
    query: ListCarsQueryReqDto,
  ): Promise<[CarsBrandsEntity[], number]> {
    const qb = this.createQueryBuilder('cars_brands')
      .leftJoinAndSelect('cars_brands.models', 'models')
      .leftJoinAndSelect('cars_brands.cars_brands_user', 'user')
      .take(query.limit)
      .skip(query.offset);

    if (query.search) {
      qb.andWhere(
        '(cars_brands.brands_name ILIKE :search, models.models_name ILIKE :search, user.id ILIKE :search)',
        { search: `%${query.search}%` },
      );
    }

    qb.orderBy('cars_brands.brands_name', 'ASC');
    return await qb.getManyAndCount();
  }
}
// public async findAll(
//   userData: IUserData,
//   query: ListArticleQueryDto,
// ): Promise<[CarsBrandsEntity[], number]> {
//   const qb = this.createQueryBuilder('article');
//   qb.leftJoinAndSelect('article.tags', 'tag');
//   qb.leftJoinAndSelect('article.user', 'user');
//   qb.leftJoinAndSelect(
//     'user.followings',
//     'following',
//     'following.follower_id = :userId',
//   );
//   qb.leftJoinAndSelect('article.likes', 'like', 'like.user_id = :userId');
//   qb.setParameter('userId', userData.userId);
//
//   if (query.search) {
//     qb.andWhere('CONCAT(article.title, article.description) ILIKE :search');
//     qb.setParameter('search', `%${query.search}%`);
//   }
//   if (query.tag) {
//     qb.andWhere('tag.name = :tag', { tag: query.tag });
//   }
//   qb.take(query.limit);
//   qb.skip(query.offset);
//   return await qb.getManyAndCount();
// }
