import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { AccountTypeEnum } from '../../../modules/auth/enums/AccountType.enum';
import { RoleTypeEnum } from '../../../modules/users/enums/RoleType.enum';
import { AdvertisementEntity } from './advertisement.entity';
import { CarsBrandsEntity } from './cars_brands.entity';
import { CarsModelsEntity } from './cars_models.entity';
import { DealershipEntity } from './dealership.entity';
import { TableNameEnum } from './enums/table-name.enum';
import { CreateUpdateModel } from './models/date.model';
import { RefreshTokenEntity } from './refresh-token.entity';
import { StatisticsEntity } from './statistics.entity';

@Index(['name'])
@Entity(TableNameEnum.USERS) // назва табл в БД
export class UserEntity extends CreateUpdateModel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  name: string;

  @Column('text', { unique: true })
  email: string;

  @Column('text', { select: false })
  password: string;

  @Column('text', { unique: true })
  phone: string;

  @Column('text', { default: AccountTypeEnum.BASIC })
  accountType: AccountTypeEnum;

  // @Column('text', { default: RoleTypeEnum.SELLER })
  // role: RoleTypeEnum;

  @Column({ type: 'enum', default: RoleTypeEnum.BUYER, enum: RoleTypeEnum })
  role: RoleTypeEnum;

  @Column('text', { nullable: true })
  dealership?: string;

  @Column('text', { nullable: true })
  avatar?: string;
  // @VirtualColumn({
  //   query: () => 'SELECT CONCAT(firstName, lastName) FROM users WHERE id = id',
  // })
  // fullName: string;
  // @VirtualColumn - це декоратор, який дозволяє створити колонку,
  // що НЕ зберігається в базі даних, але результат якої розраховується під час запиту
  // CONCAT(firstName, lastName) об'єднує два рядки (ім'я та прізвище)  по id = id

  @Column('timestamp', { nullable: true })
  deleted: Date | null;

  @OneToMany(() => RefreshTokenEntity, (entity) => entity.user)
  refreshTokens?: RefreshTokenEntity[] | null;

  @OneToMany(() => CarsBrandsEntity, (entity) => entity.cars_brands_user)
  user_cars_brands?: CarsBrandsEntity[] | null;

  @OneToMany(() => CarsModelsEntity, (entity) => entity.cars_brands_models)
  user_cars_brands_models?: CarsModelsEntity[] | null;

  @OneToMany(() => AdvertisementEntity, (entity) => entity.advertisement)
  user_advertisement?: AdvertisementEntity[] | null;

  @OneToMany(() => StatisticsEntity, (entity) => entity.statistics)
  user_statistics?: StatisticsEntity[] | null;

  @Column('text', { nullable: true })
  dealership_id?: string;
  @ManyToOne(() => DealershipEntity, (entity) => entity.users)
  @JoinColumn({ name: 'dealership_id' })
  dealership_users?: DealershipEntity | null;
}
