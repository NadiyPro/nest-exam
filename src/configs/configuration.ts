import * as process from 'node:process';

import { Config } from './config.type';

export default (): Config => ({
  app: {
    port: parseInt(process.env.APP_PORT, 10) || 3000,
    host: process.env.APP_HOST,
  }, // Налаштування програми
  database: {
    host: process.env.POSTGRES_HOST,
    port: parseInt(process.env.POSTGRES_PORT, 10) || 5432,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    name: process.env.POSTGRES_DB,
  },
  // parseInt — це функція в JavaScript,
  // яка перетворює рядок (string) на ціле число (integer)
  // Налаштування бази даних PostgreSQL
  //Тип даних: Реляційна база даних для структурованих даних
  // Призначення: Використовується для зберігання таблиць з даними,
  // що мають зв'язки між собою, складні запити SQL, підтримка JSON,
  // підходить для тривалого зберігання і складних аналітичних операцій,
  // підходить для великих корпоративних додатків,
  // CRM-систем, банківських додатків, електронної комерції тощо
  // PostgreSQL: Більш повільна через використання дискових операцій
  redis: {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT, 10) || 6379,
    password: process.env.REDIS_PASSWORD,
  }, // Налаштування бази даних Redis
  //Тип даних: Ін-меморі база даних для ключ-значення.
  // Призначення: Використовується для кешування,
  // швидкого доступу до тимчасових даних або обчислень.
  // Особливості: Дуже висока швидкість доступу до даних через зберігання даних у пам'яті,
  // підтримка структур даних, таких як списки, хеші, множини,
  // підтримка публікацій/підписок для повідомлень, підходить для систем реального часу,
  // таких як чати, інформаційні панелі, лічильники відвідувань тощо
  aws: {
    accessKey: process.env.AWS_ACCESS_KEY,
    secretKey: process.env.AWS_SECRET_KEY,
    bucketName: process.env.AWS_S3_BUCKET_NAME,
    region: process.env.AWS_S3_REGION,
    ACL: process.env.AWS_S3_ACL,
    endpoint: process.env.AWS_S3_ENDPOINT,
  }, // Налаштування для MinIO (accessKey, secretKey)
  // MinIO — це об'єктне сховище.
  //Тип даних: Об'єктне сховище для файлів, схоже на те, що надає Amazon (aws) S3.
  // Призначення: Використовується для
  // зберігання великих файлів (об'єктів) — від документів до мультимедійних даних.
  // Особливості: Сумісність із S3 API, висока масштабованість для
  // зберігання даних у клауд-середовищах.
  // Воно є сумісним з Amazon S3 API
  // відмінність miniO від aws в тому,
  // що ця штука в нас локальна і для локальної розробки нам не треба буде чіпати бакети на aws
  // sentry: {
  //   dsn: process.env.SENTRY_DSN,
  //   env: process.env.SENTRY_ENV,
  //   debug: process.env.SENTRY_DEBUG === 'true',
  // },
  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET,
    accessExpiresIn: parseInt(process.env.JWT_ACCESS_EXPIRES_IN, 10) || 3600,
    refreshSecret: process.env.JWT_REFRESH_SECRET,
    refreshExpiresIn: parseInt(process.env.JWT_REFRESH_EXPIRES_IN, 10) || 86400,
  },
  email: {
    email: process.env.SMTP_EMAIL,
    password: process.env.SMTP_PASSWORD,
  },
});
