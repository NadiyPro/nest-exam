import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { IUserData } from '../../../modules/auth/models/interfaces/user_data.interface';
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

  public async findAll(
    userData: IUserData,
    query: ListUsersQueryReqDto,
  ): Promise<[UserEntity[], number]> {
    const qb = this.createQueryBuilder('users');
    qb.take(query.limit);
    //кількість результатів за допомогою limit
    qb.skip(query.offset);
    // скільки пропустити

    if (query.search) {
      qb.andWhere('CONCAT(users.name) ILIKE :search');
      // andWhere — це метод, який додає умову AND до SQL-запиту
      // У даному випадку це означає, що ми додаємо умову пошуку до запиту,
      // щоб знайти статті, які відповідають критеріям
      // Виконує пошук по частковому збігу
      // (ILIKE у PostgreSQL — нечутливий до регістру пошук,
      // а :search - це параметр, який буде замінено реальним значенням пізніше у запиті)
      // за умовою, де title або description містить рядок, вказаний у query.search
      // CONCAT - Об’єднує значення полів title і description для кожної статті в один рядок.
      // Це дає можливість шукати значення search у будь-якій частині цих полів
      qb.setParameter('search', `%${query.search}%`);
      // передає значення для параметра :search з використанням шаблону `%${query.search}%`,
      // де % означає «будь-яка кількість символів до або після»
    } //  Перевіряє, чи містить об'єкт query параметр search. Якщо так, додає умову пошуку
    return await qb.getManyAndCount();
  }
}
