import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

import { Config, RedisConfig } from '../../configs/config.type';
import { RedisService } from './services/redis.service';

@Module({
  providers: [
    {
      provide: 'REDIS_CLIENT',
      //  провайдер реєструється під назвою 'REDIS'.
      //  У будь-якому іншому місці програми його можна буде підключити через токен 'REDIS'
      useFactory: (configService: ConfigService<Config>) => {
        // useFactory - функція, яка виконує логіку для налаштування підключення до БД.
        // Вона отримує ConfigService як залежність і використовує його для отримання налаштувань БД.
        const config = configService.get<RedisConfig>('redis');
        // конфігурація завантажується з ConfigService,
        // з файлу configuration по ключу 'redis'
        return new Redis({
          port: config.port,
          host: config.host,
          password: config.password,
        });
      },
      inject: [ConfigService],
      // Вказується масив сервісів, які інжектуються (підкидується) в useFactory
    },
    RedisService,
    //  провайдер RedisService зв'язаний з 'REDIS_CLIENT'
    // розміщений тут він нам дає можливість стукатись зовні, тобто далі викликати експорт з ним
  ],
  exports: [RedisService],
}) // підключення до Redis через бібліотеку ioredis
// providers - визначає, які провайдери (сервіси або інші інстанції)
// будуть доступні у цьому модулі.
export class RedisModule {}
