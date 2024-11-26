import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { RoleTypeEnum } from '../../../modules/users/enums/RoleType.enum';
import { ListUsersQueryReqDto } from '../../../modules/users/models/dto/req/list-users-query.req.dto';
import { UserEntity } from '../../postgres/entities/user.entity';

@Injectable()
export class UserRepository extends Repository<UserEntity> {
  //  Клас UserRepository наслідується від класу Repository<UserEntity>,
  //  що дозволяє використовувати стандартні методи репозиторію TypeORM
  //  (як-от find, save, delete, update тощо) для сутності UserEntity
  constructor(private readonly dataSource: DataSource) {
    // інжектується DataSource — клас TypeORM,
    // який надає доступ до менеджера підключення та управління базою даних
    super(UserEntity, dataSource.manager);
    // super() ініціалізує батьківський клас (Repository<UserEntity>) з параметрами:
    // UserEntity — сутність, з якою працює цей репозиторій.
    // dataSource.manager — це менеджер БД ("помічник") від TypeORM, який знає,
    // як спілкуватися з базою даних, і ми використовуємо його для роботи з UserEntity
    // (дозволяє використовувати всі методи create/findAll/findOne/update/remove/delete і т.п)
  }

  public async findAllManager(): Promise<[UserEntity[]]> {
    const qb = this.createQueryBuilder('users');
    qb.where('users.role = :role', { role: RoleTypeEnum.MANAGER });
    return;
  }

  public async giveRole(
    userId: string,
    role: RoleTypeEnum,
  ): Promise<UserEntity> {
    const user = await this.findOne({ where: { id: userId } });
    if (!user) throw new Error('User not found');
    user.role = role;
    return await this.save(user);
  }

  public async findAll(
    query: ListUsersQueryReqDto,
  ): Promise<[UserEntity[], number]> {
    const qb = this.createQueryBuilder('users');
    qb.take(query.limit);
    qb.skip(query.offset);

    if (query.search) {
      qb.andWhere('CONCAT(users.name) ILIKE :search');
      qb.setParameter('search', `%${query.search}%`);
    }

    qb.orderBy('name', 'ASC');
    return await qb.getManyAndCount();
  }
}
