import { Injectable, OnModuleInit } from '@nestjs/common';
import * as fs from 'fs';
import { DataSource } from 'typeorm';

import { UserEntity } from '../../../../infrastructure/postgres/entities/user.entity';

@Injectable()
export class AdvertisementJSONService implements OnModuleInit {
  constructor(private readonly dataSource: DataSource) {}

  onModuleInit(): void {}
  private readJSON(): {
    users: UserEntity[];
  } {
    const filePath =
      'C:/Users/User/nest-exam/src/modules/advertisement/advertisementJSON/advertisement.json';
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data);
  }

  public async importAdvertisementJSON(): Promise<void> {
    const data = this.readJSON();

    const qb = this.dataSource.createQueryRunner();
    await qb.connect();
    await qb.startTransaction();

    try {
      for (const user of data.users) {
        let userData = await qb.manager.findOne(UserEntity, {
          where: { email: user.email, phone: user.phone },
        });

        if (!userData) {
          userData = qb.manager.create(UserEntity, {
            name: user.name,
            email: user.email,
            password: user.password,
            phone: user.phone,
            accountType: user.accountType,
            role: user.role,
            avatar: user.avatar,
            deleted: user.deleted,
            dealership: user.dealership,
          });
          await qb.manager.save(userData);
        }
      }

      await qb.commitTransaction();
    } catch (error) {
      await qb.rollbackTransaction();
      throw error;
    } finally {
      await qb.release();
    }
  }
}
