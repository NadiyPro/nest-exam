import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

// import { APP_FILTER } from '@nestjs/core';
// import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import configuration from './configs/configuration';
import { PostgresModule } from './infrastructure/postgres/postgres.module';
import { RedisModule } from './infrastructure/redis/redis.module';
import { RepositoryModule } from './infrastructure/repository/repository.module';
import { AuthModule } from './modules/auth/auth.module';
import { CarsModule } from './modules/cars/cars.module';
import { EmailModule } from './modules/email/email.module';
import { UsersModule } from './modules/users/users.module';
import { AvertisementModule } from './modules/advertisement/advertisement.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    RepositoryModule,
    PostgresModule,
    RedisModule,
    AuthModule,
    UsersModule,
    CarsModule,
    EmailModule,
    AvertisementModule,
  ],
})
export class AppModule {}
