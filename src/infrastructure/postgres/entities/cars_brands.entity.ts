import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { CarsModelsEntity } from './cars_models.entity';
import { TableNameEnum } from './enums/table-name.enum';
import { CreateUpdateModel } from './models/date.model';
import { UserEntity } from './user.entity';

@Entity(TableNameEnum.CARS_BRANDS)
export class CarsBrandsEntity extends CreateUpdateModel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  brands_name: string;

  @OneToMany(() => CarsModelsEntity, (entity) => entity.cars_brands_models)
  models: CarsModelsEntity[];

  @Column('timestamp', { nullable: true })
  deleted: Date | null;

  @Column()
  user_id: string;
  @ManyToOne(() => UserEntity, (entity) => entity.user_cars_brands_models)
  @JoinColumn({ name: 'user_id' })
  cars_brands_user: UserEntity;
}
