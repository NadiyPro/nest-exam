import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config/dist/config.service';

import { Config, JwtConfig } from '../../../configs/config.type';
import { RedisService } from '../../../infrastructure/redis/services/redis.service';

@Injectable()
export class AuthCacheService {
  private jwtConfig: JwtConfig;
  // запис над конструктором дозволяє оголосити і
  // типізувати цю властивість заздалегідь,
  // що робить її доступною у всьому класі, включаючи конструктор

  constructor(
    private readonly redisService: RedisService,
    private readonly configService: ConfigService<Config>,
  ) {
    this.jwtConfig = this.configService.get('jwt');
  } // Зберігає налаштування 'jwt', отримані з configService

  public async saveToken(
    token: string,
    userId: string,
    deviceId: string,
  ): Promise<void> {
    const key = `ACCESS_TOKEN:${userId}:${deviceId}`;
    // Зберігає токен доступу (token) у Redis за допомогою ключа,
    // який базується на ідентифікаторі користувача (userId) і пристрої (deviceId)
    // завдяки ключу ми зможемо швидко шукати потрібні нам записи в Redis,
    // бо чим унікальніші ключі, тим швидше вибірка буде працювати
    await this.redisService.deleteByKey(key);
    // Спочатку видаляє можливі попередні значення цього ключа (deleteByKey)
    await this.redisService.addOneToSet(key, token);
    // Додає новий токен до множини (addOneToSet)
    await this.redisService.expire(key, this.jwtConfig.accessExpiresIn);
    // Встановлює час життя ключа (expire), використовуючи налаштування accessExpiresIn із jwtConfig
  }
  public async isAccessTokenExist(
    userId: string,
    deviceId: string,
    token: string,
  ): Promise<boolean> {
    const key = this.getKey(userId, deviceId);
    // створюємо унікальний ключ для збереження токена в Redis
    const set = await this.redisService.sMembers(key);
    // отримується список всіх токенів, пов’язаних із цим ключем.
    return set.includes(token);
    // перевіряється, чи містить цей список потрібний token
    // Повернене значення: true, якщо токен знайдено в списку; інакше false
  }
  // перевіряємо, чи існує певний токен доступу в Redis

  public async deleteToken(userId: string, deviceId: string): Promise<void> {
    const key = this.getKey(userId, deviceId);
    // створюємо унікальний ключ для збереження токенів в Redis
    await this.redisService.deleteByKey(key);
    // видалити всі токени, збережені для цього ключа
  }
  public async deleteTokenUserId(userId: string): Promise<void> {
    const key = this.getKeyUserId(userId);
    await this.redisService.deleteByKey(key);
    // видалити всі токени, збережені для цього ключа
  }

  private getKey(userId: string, deviceId: string): string {
    return `ACCESS_TOKEN:${userId}:${deviceId}`;
  } // створює унікальний ключ для зберігання токенів у Redis
  // щоб у кожного юзера (userId) на конкретному пристрої (deviceId) був свій унікальний ключ

  private getKeyUserId(userId: string): string {
    return `ACCESS_TOKEN:${userId}`;
  }
}
