import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { CarsModelsEntity } from './cars_models.entity';
import { DealershipEntity } from './dealership.entity';
import { CurrencyEnum } from './enums/currency_enum';
import { IsValidEnum } from './enums/isValid.enum';
import { TableNameEnum } from './enums/table-name.enum';
import { CreateUpdateModel } from './models/date.model';
import { StatisticsEntity } from './statistics.entity';
import { UserEntity } from './user.entity';

@Index(['advertisement_cars,user_id'])
@Entity(TableNameEnum.ADVERTISEMENT)
export class AdvertisementEntity extends CreateUpdateModel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('number')
  price: number;

  @Column('text', { default: CurrencyEnum.UAH })
  original_currency: CurrencyEnum;

  @Column('number')
  courseUAH: number;

  @Column('number')
  courseUSD: number;

  @Column('number')
  courseEUR: number;

  @Column('number')
  priceUAH: number;

  @Column('number')
  priceUSD: number;

  @Column('number')
  priceEUR: number;

  @Column('text')
  region: string;

  @Column('text')
  image_cars: string;

  @Column('text', { default: IsValidEnum.ACTIVE })
  isValid: IsValidEnum;

  @Column('text')
  text_advertisement: string;

  @Column()
  user_id: string;
  @ManyToOne(() => UserEntity, (entity) => entity.user_advertisement)
  @JoinColumn({ name: 'user_id' })
  advertisement: UserEntity;

  @Column()
  cars_brands_models_id: string;
  @OneToOne(() => CarsModelsEntity, (entity) => entity.cars_brands_models)
  @JoinColumn({ name: 'cars_brands_models_id' })
  advertisement_cars: CarsModelsEntity;

  @OneToOne(() => StatisticsEntity, (entity) => entity.statistics_advertisement)
  advertisement_statistics: StatisticsEntity;

  @Column()
  dealership_id: string;
  @ManyToOne(() => DealershipEntity, (entity) => entity.users)
  @JoinColumn({ name: 'dealership_id' })
  dealership?: DealershipEntity;
}
