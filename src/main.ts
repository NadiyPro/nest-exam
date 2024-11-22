import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';
import { SwaggerHelper } from './common/helpers/swagger.helper';
import { AppConfig } from './configs/config.type';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  //Ця команда створює новий екземпляр додатка на основі AppModule за допомогою NestFactory.
  // Вона ініціалізує всі компоненти програми, налаштовує залежності та маршрутизацію.

  const config = new DocumentBuilder() //  Створює новий об'єкт для побудови конфігурації Swagger
    .setTitle('March-2024 NestJS') // Встановлює заголовок API документації
    .setDescription('The cats API description') // опис нашого API
    .setVersion('1.0') // версія нашого API
    .addBearerAuth({
      in: 'header', //вказує, що токен буде передаватися в заголовку HTTP-запиту.
      type: 'http', // тип авторизації — HTTP
      scheme: 'bearer', // Схема авторизації — Bearer
      bearerFormat: 'JWT', //  Формат токена — JWT (JSON Web Token).
    }) // Додає налаштування для авторизації типу Bearer, що використовується для JWT токенів
    .build(); // Створює остаточну конфігурацію на основі вказаних параметрів

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      // ця опція автоматично видаляє всі властивості,
      // яких немає у валідаційних класах.Якщо клієнт надішле додаткові поля у запиті,
      // які не зазначені в DTO, вони будуть автоматично видалені.
      transform: true,
      // transform: true, вхідні дані (наприклад, об'єкт JSON)
      // перетворюються на екземпляри класів, що дозволяє виконувати типізацію й перевірку типів
      // щоб працювали декоратори трансформерів, ми ОБОВЯЗКОВО маємо вказати transform: true
      forbidNonWhitelisted: true,
      // Якщо клієнт надішле зайві поля, додаток поверне помилку, вказуючи, що ці поля неприпустимі.
    }),
  ); // app.useGlobalPipes - ця функція додає глобальні пайпи в додаток.
  // Пайпи в NestJS застосовуються до вхідних даних
  // і можуть використовуватися для валідації, перетворення та ін.
  // ValidationPipe — це вбудований пайп у NestJS,
  // який використовує бібліотеку class-validator для валідації об'єктів і класів.
  // Він автоматично перевіряє дані, що надходять,
  // на основі валідаційних правил, визначених у класах за допомогою декораторів
  // Пайп( pipe) - це механізм обробки вхідних даних перевірка/перетворення перед тим,
  // як вони будуть передані у відповідні методи контролера

  const document = SwaggerModule.createDocument(app, config);
  // Генерує документ Swagger (OpenAPI специфікацію)
  // на основі нашого NestJS додатку (app) та створеної конфігурації (config).
  SwaggerHelper.setDefaultResponses(document);
  // // змінює документ Swagger (що представляє собою OpenAPI специфікацію)
  // // і додає загальні відповіді для всіх маршрутів у вашому API
  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      docExpansion: 'list',
      // Встановлює, як розкривати розділи документації.
      // 'list' означає, що всі розділи будуть показані у вигляді списку і згорнуті за замовчуванням
      defaultModelsExpandDepth: 7,
      // Визначає глибину, до якої будуть розкриватися моделі даних.
      // Число 7 означає, що вкладені моделі будуть розкриті до 7 рівнів.
      persistAuthorization: true,
      // Дозволяє зберігати стан авторизації між перезавантаженнями сторінки.
      // Тобто, якщо ви ввели токен авторизації, він залишиться активним навіть після оновлення сторінки.
    },
  });
  // Налаштовує маршрут /docs, за яким буде доступна ваша Swagger документація
  const configService = app.get(ConfigService);
  // дістаємо конфігураційний сервіс з configuration.ts
  const appConfig = configService.get<AppConfig>('app');
  // отримує конфігурацію з configuration.ts
  // доступившись до нього в по ключам 'app' з типом AppConfig
  await app.listen(appConfig.port, () => {
    console.log(
      `Server is running on http://${appConfig.host}:${appConfig.port}`,
    );
    console.log(
      `Swagger is running on http://${appConfig.host}:${appConfig.port}/docs`,
    );
  });
  console.log();
}
void bootstrap();
