import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { CarsBrandsEntity } from '../../postgres/entities/cars_brands.entity';

@Injectable()
export class CarsBrandsRepository extends Repository<CarsBrandsEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(CarsBrandsEntity, dataSource.manager);
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
}
