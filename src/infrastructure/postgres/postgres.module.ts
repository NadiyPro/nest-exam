import * as path from 'node:path';
import * as process from 'node:process';

import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Config, DatabaseConfig } from '../../configs/config.type';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService<Config>) => {
        // useFactory - функція, яка виконує логіку для налаштування підключення до БД.
        // Вона отримує ConfigService як залежність і використовує його для отримання налаштувань БД.
        const config = configService.get<DatabaseConfig>('database');
        // конфігурація для TypeORM завантажується з ConfigService,
        // з файлу configuration по ключу 'database'
        return {
          type: 'postgres', // вказуємо доя якої БД будемо конектитись
          host: config.host,
          port: config.port,
          username: config.user,
          password: config.password,
          database: config.name,
          entities: [
            path.join(
              process.cwd(),
              'dist',
              'src',
              'infrastructure',
              'postgres',
              'entities',
              '*.entity.js',
            ),
          ], // Шлях до файлів ентіті
          // Ентіті - описує структуру таблиці в БД, це типу як моделі,
          // кожна модель - це окрема таблиця буде,
          // ми для юзера такий опис зробили в database/entities/user.entity.ts
          // Файли з розширенням *.entity.js — це скомпільовані версії файлів ентіті,
          // де * - значить всі назви файлів, після крапки де йде розширення entity.js
          // які використовуються в TypeORM для відображення об'єктів в БД, тобто описує структуру таблиці в БД
          // (кажемо яка назва табл буде, який стовпчик / строка, яку матиме назву, та чим наповнюватиметься)
          // Node.js не вміє виконувати TypeScript напряму.
          // TypeORM та інші бібліотеки завантажують ентіті та інші файли з папки dist,
          // яка містить уже скомпільовані .js версії файлів.
          // Тому ми вказуємо шлях саме до папки dist в якій містяться скомпільовані файли в форматі js
          migrations: [
            path.join(
              process.cwd(),
              'dist',
              'src',
              'infrastructure',
              'postgres',
              'migrations',
              '*.js',
            ),
          ], // Шлях до файлів міграцій у папці dist (щоб виконувати міграції)
          synchronize: false,
          // Якщо встановлено в false,
          // TypeORM не синхронізуватиме схему бази даних автоматично
          // (це рекомендується для продакшн середовища), тобто працюємо завжди з synchronize: false
          migrationsRun: true,
          // Автоматичний запуск міграцій при кожному старті додатка.
        };
      },
      inject: [ConfigService],
      // Вказується масив сервісів, які інжектуються (підкидується) в useFactory.
      // У цьому випадку інжектується ConfigService, який відповідає за надання налаштувань
    }),
  ],
})
export class PostgresModule {}
