import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { ListCarsQueryReqDto } from '../../../modules/cars/models/dto/req/list-cars-query.req.dto';
import { CarsResDto } from '../../../modules/cars/models/dto/res/cars.res.dto';
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

  // public async findAllCars(
  //   query: ListCarsQueryReqDto,
  // ): Promise<[CarsResDto[], number]> {
  //   const [entities, total] = await this.createQueryBuilder('cars_brands')
  //     .leftJoinAndSelect('cars_brands.models', 'models')
  //     .leftJoinAndSelect('cars_brands.cars_brands_user', 'user')
  //     .take(query.limit)
  //     .skip(query.offset)
  //     .andWhere(
  //       query.search
  //         ? '(cars_brands.brands_name ILIKE :search OR models.models_name ILIKE :search)'
  //         : '1=1',
  //       { search: `%${query.search}%` },
  //     )
  //     .orderBy('cars_brands.brands_name', 'ASC')
  //     .getManyAndCount();
  //
  //   const carsResDto = entities.map((entity) => ({
  //     id: entity.id,
  //     brands_id: entity.id,
  //     brands_name: entity.brands_name,
  //     models_name: entity.models.map((model) => model.models_name).join(', '),
  //     user_id: entity.user_id,
  //   }));
  //
  //   return [carsResDto, total];
  // }

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
        '(cars_brands.brands_name ILIKE :search OR models.models_name ILIKE :search)',
        { search: `%${query.search}%` },
      );
    }

    qb.orderBy('cars_brands.brands_name', 'ASC');
    return await qb.getManyAndCount();
  }

  // public async findAllCars(
  //   query: ListCarsQueryReqDto,
  // ): Promise<[CarsResDto[], number]> {
  //   const qb = this.createQueryBuilder('cars_brands');
  //   qb.leftJoinAndSelect('cars_brands.models', 'models');
  //   qb.leftJoinAndSelect('cars_brands.cars_brands_user', 'user');
  //   qb.take(query.limit);
  //   qb.skip(query.offset);
  //   if (query.search) {
  //     qb.andWhere(
  //       '(cars_brands.brands_name ILIKE :search, models.models_name ILIKE :search)',
  //     );
  //     qb.setParameter('search', `%${query.search}%`);
  //   }
  //   qb.orderBy('cars_brands.brands_name', 'ASC');
  //   return await qb.getManyAndCount();
  // }
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
