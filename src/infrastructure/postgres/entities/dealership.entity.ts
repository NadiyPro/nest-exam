import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { AdvertisementEntity } from './advertisement.entity';
import { TableNameEnum } from './enums/table-name.enum';
import { CreateUpdateModel } from './models/date.model';
import { UserEntity } from './user.entity';

@Entity(TableNameEnum.DEALERSHIP)
export class DealershipEntity extends CreateUpdateModel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  name: string;

  @OneToMany(() => UserEntity, (entity) => entity.dealership_users)
  users?: UserEntity[];

  @OneToMany(() => AdvertisementEntity, (entity) => entity.dealership)
  advertisements?: AdvertisementEntity[];
}
