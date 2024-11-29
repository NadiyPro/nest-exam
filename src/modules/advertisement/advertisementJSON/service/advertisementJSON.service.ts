import * as fs from 'node:fs';

import { Injectable, OnModuleInit } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { DataSource } from 'typeorm';

import { AdvertisementEntity } from '../../../../infrastructure/postgres/entities/advertisement.entity';

@Injectable()
export class AdvertisementJSONService implements OnModuleInit {
  constructor(private readonly dataSource: DataSource) {}

  onModuleInit(): void {}

  readJSON(): {
    curBuyingUSD: number;
    curSalesUSD: number;
    curBuyingEUR: number;
    curSalesEUR: number;
  } {
    const filePath =
      'C:/Users/User/nest-exam/src/modules/advertisement/advertisementJSON/advertisement.json';
    if (!fs.existsSync(filePath)) {
      throw new Error('JSON файл не знайдено.');
    }
    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    return data.advertisement[0]; // Звертаємо увагу на правильність доступу до об'єкта
  }

  @Cron('0 5 * * *') // Виконувати щодня о 5:00 ранку
  public async updateCurrencyRates(): Promise<void> {
    const rates = this.readJSON();

    await this.dataSource
      .createQueryBuilder()
      .update(AdvertisementEntity)
      .set(rates)
      .execute();

    console.log('Курси валют оновлено успішно.');
  }
}
