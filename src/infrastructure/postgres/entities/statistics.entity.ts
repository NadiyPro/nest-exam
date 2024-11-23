import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { AdvertisementEntity } from './advertisement.entity';
import { TableNameEnum } from './enums/table-name.enum';
import { CreateUpdateModel } from './models/date.model';
import { UserEntity } from './user.entity';

@Entity(TableNameEnum.STATISTICS)
export class StatisticsEntity extends CreateUpdateModel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('integer')
  views_all: number;

  @Column('integer')
  views_day: number;

  @Column('integer')
  views_week: number;

  @Column('integer')
  views_month: number;

  @Column('float')
  ave_price_region: number;

  @Column('float')
  ave_price_Ukraine: number;

  @Column()
  user_id: string;
  @ManyToOne(() => UserEntity, (entity) => entity.user_statistics)
  @JoinColumn({ name: 'user_id' })
  statistics: UserEntity;

  @Column()
  advertisement_id: string;
  @OneToOne(
    () => AdvertisementEntity,
    (entity) => entity.advertisement_statistics,
  )
  @JoinColumn({ name: 'advertisement_id' })
  statistics_advertisement: AdvertisementEntity;
}
