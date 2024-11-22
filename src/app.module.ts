import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

// import { APP_FILTER } from '@nestjs/core';
// import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import configuration from './configs/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      // forRoot() - метод, який налаштовує модуль конфігурації на глобальному рівні
      load: [configuration],
      // функція configuration завантажує конфігураційні параметри,
      // які будуть використовуватися в ConfigService,
      // тобто configuration це типу наш ConfigService
      isGlobal: true,
      // Вказує, що цей модуль доступний глобально в застосунку,
      // тобто його не потрібно додатково імпортувати в інших модулях
    }),
    // ConfigModule — це вбудований модуль, який використовується
    // для керування конфігураційними параметрами додатку.
    // Він дозволяє легко завантажувати та використовувати налаштування з різних джерел.
    // ConfigModule.forRoot() завантажує конфігурацію з функції configuration і робить
    // її доступною через ConfigService в усьому застосунку.
    // наприклад, з файлів .env, з об'єктів конфігурації, або з інших джерел.
    // в нашому прикладі ми доступаємось до змінних розміщених у файлі configuration
    // (тобто, налаштувань різних параметрів, які можуть бути нами використані)
    // RepositoryModule,
    // PostgresModule,
    // RedisModule,
    //
    // AuthModule,
    // UsersModule,
  ],
  // providers: [
  //   {
  //     provide: APP_FILTER,
  //     useClass: GlobalExceptionFilter,
  //   },
  // ],
  //  масив providers використовується для конфігурації глобального фільтрів.
  //  Властивість provide визначає токен (ключ) APP_FILTER,
  //  який буде використовуватися для ідентифікації фільтра,
  //  а властивість useClass вказує клас, який використовується як фільтр (GlobalExceptionFilter).
  // GlobalExceptionFilter - використовується як глобальний фільтр,
  // щоб контролювати та обробляти виключення, що виникають в додатку.
})
export class AppModule {}
